const { MessageEmbed } = require('discord.js')
const fs = require('fs')

module.exports = {
  "name": "lvlinfo",
  "description": "level list",
  run: async (bot, message, args) => {
    var embed = new MessageEmbed()
      .setColor("#E20023")
      .setTitle("Levels Info");
      fs.readFile('./db/levels.json', (err, data) => {
        if (err) throw err
        var levelsData = JSON.parse(data).levels
        console.log(levelsData)
        levelsData.forEach(level => {
          embed.addField(`${level.name}`, `Opens at level: ${level.level}`, false)
        })
        message.channel.send(embed)
      })
     
  }
}