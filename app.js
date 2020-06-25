const { Client, MessageAttachment, Collection, MessageEmbed } = require('discord.js')
const client = new Client()
const fs = require('fs')
const config = require('./config.json')
require('dotenv').config()

client.commands = new Collection()

client.once('ready', () => {
    client.user.setActivity(`${prefix}help`, { type: 'WATCHING' })
    console.log(`${client.user.username} is ready!`)
})

fs.readdir('./commands/', (err, file) => {
    if (err) throw err
    let jsfile = file.filter(f => f.endsWith('.js'))
    if (jsfile.length <= 0) {
        console.log('Такой команды нет')
        return
    }

    jsfile.forEach((file, i) => {
        let props = require(`./commands/${file}`)
        console.log(`${file} ✅`)
        client.commands.set(props.name, props)
    })
})

const prefix = config.prefix



client.on('message', async message => {
    if (message.author.bot) return
    let messageArray = message.content.split(' ')
    let cmd = messageArray[0]
    let args = messageArray.slice(1)

    let commandfile = client.commands.get(cmd.slice(prefix.length))
    if (commandfile) commandfile.run(client, message, args)

    if (cmd === `${prefix}help`) {
        const embed = new MessageEmbed()
            .setColor('#E20023')
            .setTitle('Help');
        client.commands.forEach(command => {
            embed.addField(`${prefix}${command.name}`, `${command.description}`, true)

        })
        message.channel.send(embed)

    }
})

client.login(process.env.TOKEN)


