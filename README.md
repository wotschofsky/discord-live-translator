# Discord Live Translation Bot

A bot that automatically translate voice chat into a user pickable language in order to provide an easy way to communicate through voice chat for individuals speaking different languages natively.

Use `!translation help` for an overview of all available commands.

Note:
This bot requires api keys for IBM Watson Speech to Text, Text to Speech and Language Translator. Keys are available without a credit card!
Download your keys from the site and put them in a .env file with their default names along side a discord bot token. This should look something like this:

```
BOT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

SPEECH_TO_TEXT_IAM_APIKEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SPEECH_TO_TEXT_URL=https://stream.watsonplatform.net/speech-to-text/api

TEXT_TO_SPEECH_IAM_APIKEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TEXT_TO_SPEECH_URL=https://stream.watsonplatform.net/text-to-speech/api

LANGUAGE_TRANSLATOR_IAM_APIKEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LANGUAGE_TRANSLATOR_URL=https://gateway.watsonplatform.net/language-translator/api
```
