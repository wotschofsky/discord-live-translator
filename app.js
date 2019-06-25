require('dotenv').config()
require('./utils/validateEnv')

const Discord = require('discord.js')


const client = new Discord.Client()


client.on('ready', require('./clientHandlers/ready')(client))
client.on('message', require('./clientHandlers/message')(client))


client.login(process.env.BOT_TOKEN)
