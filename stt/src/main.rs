#![feature(proc_macro_hygiene, decl_macro)]

use std::cmp;
use std::env;
use std::fs;
use std::path::Path;
use std::sync::atomic::{AtomicUsize, Ordering};

use rocket::Data;
use rocket::State;

use whisper_rs::{FullParams, SamplingStrategy, WhisperContext};

#[macro_use]
extern crate rocket;

struct Context {
    whisper: WhisperContext,
    request_id: AtomicUsize,
}

#[post("/", data = "<body>")]
fn upload(body: Data, ctx: State<Context>) -> Result<String, Box<dyn std::error::Error>> {
    let current_count = ctx.request_id.fetch_add(1, Ordering::SeqCst);
    let filename = format!("upload/{id}.wav", id = current_count);
    fs::create_dir_all("upload/").expect("Failed to create \"upload/\" directory");
    body.stream_to_file(Path::new(&filename))?;

    let mut reader = hound::WavReader::open(&filename)?;
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

    let mut state = ctx.whisper.create_state().expect("failed to create state");
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

    fs::remove_file(&filename).expect("Failed to remove uploaded file");

    Ok(result)
}

fn main() {
    let model_path = env::var("MODEL_PATH").expect("MODEL_PATH is not set in env");
    let ctx = WhisperContext::new(&model_path).expect("failed to load model");

    rocket::ignite()
        .mount("/", routes![upload])
        .manage(Context {
            whisper: ctx,
            request_id: AtomicUsize::new(0),
        })
        .launch();
}
