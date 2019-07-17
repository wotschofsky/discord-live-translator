Demo video: https://streamable.com/adul0

# Discord Live Translation Bot

A bot that automatically translate voice chat into a user selectable language in order to provide an easy way to communicate through voice chat for individuals speaking different languages natively.

## How to use

1. Join a voice channel
2. Make the bot join your channel by typing `!translation join`
3. Use `!translation start <from> <to>` to select source and destination language and start the translation for yourself
4. Just talk like normal
5. When you're done end your session using `!translation stop` and make the bot leave using `!translation leave`

Other commands:
`!translation status` tells you if you have translation mode enabled.
`!translation languages` shows you all available languages.
`!translation help` gives you an overview of all available commands.

## Setup

This bot requires api keys for IBM Watson Speech to Text, Text to Speech and Language Translator. Keys are available without a credit card!
Download your keys from the site and put them in a `.env` file with their default names along side a discord bot token. This should look something like this:

```env
BOT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

SPEECH_TO_TEXT_IAM_APIKEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SPEECH_TO_TEXT_URL=https://stream.watsonplatform.net/speech-to-text/api

TEXT_TO_SPEECH_IAM_APIKEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TEXT_TO_SPEECH_URL=https://stream.watsonplatform.net/text-to-speech/api

LANGUAGE_TRANSLATOR_IAM_APIKEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LANGUAGE_TRANSLATOR_URL=https://gateway.watsonplatform.net/language-translator/api
```
