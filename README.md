**✨ [NOW AVAILABLE AS FREE HOSTED BOT](https://discord-live-translator.felisk.io/) 🎉**

# Discord Live Translation Bot

*This is the documentation for the re-written v2 version. [Original v1 Version](/tree/v1)*

A bot that automatically translate voice chat into a user selectable language in order to provide an easy way to communicate through voice chat for individuals speaking different languages natively. This project was originally started during the 2019 Discord Hack Week hackathon.

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

## Setup using Docker

If you for whatever reason don't want to use the *free hosted version* of this bot is the easiest way to host this bot yourself is using [Docker](https://www.docker.com/).

1. Build the *Dockerfile* located in the root of the project

    `$ docker build -t discord-live-translator .`

2. Download [models and scorers](https://coqui.ai/models) for [Coqui STT](https://github.com/coqui-ai/STT) for all languages you want to support and put them in a *models* directory.

3. Set up an instance of [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate).

4. Start [containers for Mozilla TTS](https://github.com/synesthesiam/docker-mozillatts) for all languages you want to support

5. Start an instance of [Redis](https://redis.io/).

6. Start the discord-live-translator container while providing two volumes: One for the config file and one for the STT models. In addition provide the bot token from the [Discord Developer Portal](https://discord.com/developers/applications) as *BOT_TOKEN* as well as the URL for your Redis instance as *REDIS_URL* environment variables.

    ```$ docker run -e BOT_TOKEN=xxxxx -v `pwd`/config.json:/app/config.json -v `pwd`/models:/app/models discord-live-translator```

### Example config.json

```json
{
  "translationHost": "http://translator:5000", // LibreTranslate host (use https://libretranslate.com if not self-hosting)
  "languages": { // Contains all available languages
    "en": { // Unique language key
      "icon": ":flag_us:", // Fitting Icon/Emoji
      "displayName": "English", // Language display name
      "sttModel": "en/deepspeech-0.9.3-models.pbmm", // DeepSpeech Model file relative to model directory
      "sttScorer": "en/deepspeech-0.9.3-models.scorer", // DeepSpeech Scorer file relative to model directory
      "ttsHost": "http://tts:5002", // Address of Mozilla TTS Container
      "translatorCode": "en", // Language code for LibreTranslate
      "supports": "io" // Specify whether only input or output or both are supported
    },
    ...
    ...
    ...
  }
}
```
