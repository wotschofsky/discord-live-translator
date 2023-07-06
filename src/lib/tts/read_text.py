# Wrap TTS api in custom python script to improve reliability with finding downloaded models

from TTS.api import TTS
import argparse

parser = argparse.ArgumentParser(description='TTS')
parser.add_argument('--model', type=str, required=True)
parser.add_argument('--text', type=str, required=True)
parser.add_argument('--output', type=str, required=True)

args = parser.parse_args()


tts = TTS()

tts.load_tts_model_by_name(args.model, gpu=False)

tts.tts_to_file(args.text, file_path=args.output)
