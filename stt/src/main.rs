use actix_web::{web, App, HttpServer, Result};
use futures::StreamExt;
use num_cpus;
use std::cmp;
use std::env;
use std::io::Cursor;
use whisper_rs::{FullParams, SamplingStrategy, WhisperContext};

#[macro_use]
extern crate lazy_static;

lazy_static! {
    static ref WHISPER: WhisperContext = WhisperContext::new(
        env::var("MODEL_PATH")
            .expect("MODEL_PATH is not set in env")
            .as_str()
    )
    .expect("failed to load model");
}

async fn upload(mut payload: web::Payload) -> Result<String> {
    let mut body = web::BytesMut::new();
    while let Some(chunk) = payload.next().await {
        body.extend_from_slice(&chunk.unwrap());
    }
    let content = body.freeze();

    let mut reader = hound::WavReader::new(Cursor::new(content)).unwrap();
    let audio_data: Vec<f32> = reader
        .samples::<i16>()
        .filter_map(Result::ok)
        .map(|s| s as f32 / 32768.0)
        .collect();

    let mut params = FullParams::new(SamplingStrategy::Greedy { best_of: 1 });
    params.set_n_threads(cmp::min(4, num_cpus::get() as i32));
    params.set_translate(true);
    params.set_language(Some("en"));
    params.set_print_special(false);
    params.set_print_progress(false);
    params.set_print_realtime(false);
    params.set_print_timestamps(false);

    let mut state = WHISPER.create_state().expect("failed to create state");
    state
        .full(params, &audio_data[..])
        .expect("failed to run model");

    let num_segments = state
        .full_n_segments()
        .expect("failed to get number of segments");
    let mut result = "".to_owned();
    for i in 0..num_segments {
        let segment = state
            .full_get_segment_text(i)
            .expect("failed to get segment");
        result = result + &segment;
    }

    Ok(result)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    simple_logger::init_with_env().unwrap();

    match env::var("MODEL_PATH") {
        Ok(_) => (),
        Err(_) => panic!("MODEL_PATH is not set in env"),
    }

    log::info!("Starting server at http://127.0.0.1:8000");

    HttpServer::new(move || App::new().service(web::resource("/").route(web::post().to(upload))))
        .bind("0.0.0.0:8000")?
        .run()
        .await
}
