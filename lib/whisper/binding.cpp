#include "whisper.h"
#include <napi.h>
#include <sndfile.h>
#include <string>

Napi::String whisperFull(const Napi::CallbackInfo &napiInfo)
{
  Napi::Env env = napiInfo.Env();
  if (napiInfo.Length() < 2)
  {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return Napi::String::New(env, "Error");
  }

  if (!napiInfo[0].IsString())
  {
    Napi::TypeError::New(env, "First argument should be string").ThrowAsJavaScriptException();
    return Napi::String::New(env, "Error");
  }
  std::string wav_path_string = napiInfo[0].As<Napi::String>();
  const char *wav_path = wav_path_string.c_str();

  if (!napiInfo[1].IsString())
  {
    Napi::TypeError::New(env, "Second argument should be string").ThrowAsJavaScriptException();
    return Napi::String::New(env, "Error");
  }
  std::string model_path_string = napiInfo[1].As<Napi::String>();
  const char *model_path = model_path_string.c_str();

  // Load a Whisper ASR model from file
  struct whisper_context *ctx = whisper_init_from_file(model_path);

  if (!ctx)
  {
    Napi::TypeError::New(env, std::string("Failed to load whisper model: ") + model_path).ThrowAsJavaScriptException();
    return Napi::String::New(env, "Error");
  }

  // Load a WAV file as audio input
  SNDFILE *file;
  SF_INFO sfInfo;
  file = sf_open(wav_path, SFM_READ, &sfInfo);

  if (file == NULL)
  {
    Napi::TypeError::New(env, std::string("Failed to open file: ") + sf_strerror(file)).ThrowAsJavaScriptException();
    return Napi::String::New(env, "Error");
  }

  sf_count_t n_samples = sfInfo.frames * sfInfo.channels;
  float *samples = new float[n_samples];

  if (!samples)
  {
    Napi::TypeError::New(env, "Failed to allocate memory for samples").ThrowAsJavaScriptException();
    sf_close(file);
    return Napi::String::New(env, "Error");
  }

  if (sf_read_float(file, samples, n_samples) != n_samples)
  {
    Napi::TypeError::New(env, std::string("Failed to read samples from file: ") + sf_strerror(file)).ThrowAsJavaScriptException();
    sf_close(file);
    delete[] samples;
    return Napi::String::New(env, "Error");
  }

  // Set up decoding parameters
  struct whisper_full_params params = whisper_full_default_params(WHISPER_SAMPLING_GREEDY);
  params.print_progress = false;
  params.print_timestamps = false;

  // Run speech recognition
  int result = whisper_full(ctx, params, samples, n_samples);
  if (result != 0)
  {
    Napi::TypeError::New(env, std::string("Failed to process audio: ") + std::to_string(result)).ThrowAsJavaScriptException();
    whisper_free(ctx);
    delete[] samples;
    return Napi::String::New(env, "Error");
  }

  // Retrieve the recognized text
  int n_segments = whisper_full_n_segments(ctx);
  std::string full_text;
  for (int i_segment = 0; i_segment < n_segments; ++i_segment)
  {
    const char *segment_text = whisper_full_get_segment_text(ctx, i_segment);
    full_text += segment_text;
  }

  // Clean up
  whisper_free(ctx);
  delete[] samples;

  return Napi::String::New(env, full_text);
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  exports.Set(
      Napi::String::New(env, "whisperFull"),
      Napi::Function::New(env, whisperFull));
  return exports;
}

NODE_API_MODULE(whisper, Init)
