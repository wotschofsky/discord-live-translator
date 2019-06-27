const parseCommand = (command) => {
   if(command.indexOf('!') === 0)  {
      command = command.substr(1)
   }
   let obj = {}
   let splitCommand = command.split(' ')
   let params = []
   splitCommand.forEach((el, i) => {
      if(i === 0) return obj.domain = el
      if(i === 1) return obj.command = el
      params.push(el)
   })
   obj.params = params
   return obj
}


module.exports = parseCommand
