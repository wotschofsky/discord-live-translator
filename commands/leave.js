const leaveCommand = (client, message, command) => {
   message.member.voiceChannel.leave()
}


module.exports = leaveCommand
