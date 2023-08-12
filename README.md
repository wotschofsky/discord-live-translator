**✨ [NOW AVAILABLE AS FREE HOSTED BOT](https://livetranslator.xyz) 🎉**

# Discord Live Translation Bot

*This is the documentation for the re-written v2 version. [Original v1 Version](/tree/v1)*

A bot that automatically translate voice chat into a user selectable language in order to provide an easy way to communicate through voice chat for individuals speaking different languages natively. This project was originally started during the 2019 Discord Hack Week hackathon.

## How to use

1. Join a voice channel
2. Make the bot join your channel by typing `/join`
3. Use `/start <target>` to select the target language and start the translation for yourself
4. Just talk like normal
5. Once you're done end your session using `/stop` and make the bot leave your channel using `/leave`

Other commands:
`/status` tells you if you have translation mode enabled.
`/languages` shows you all available languages.

## Setup using Docker

If you for whatever reason don't want to use the *free hosted version* of this bot is the easiest way to host this bot yourself is using [Docker](https://www.docker.com/). You can get the required credentials from the [Discord Developer Portal](https://discord.com/developers/applications).

1. Clone the repo
2. Configure a `.env` file with appropriate values for `BOT_TOKEN` and `CLIENT_ID`
3. Run `docker compose up -f docker-compose.prod.yml -d`
