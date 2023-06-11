from TTS.api import TTS

models = [
  'tts_models/en/ljspeech/vits',
  'tts_models/de/thorsten/vits',
  'tts_models/fr/mai/tacotron2-DDC',
  'tts_models/es/mai/tacotron2-DDC',
  'tts_models/it/mai_female/vits',
]

tts = TTS()

for model_name in models:
    tts.download_model_by_name(model_name=model_name)
