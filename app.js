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
            .setThumbnail('https://i.imgur.com/8ySqBJS.png')
            .setTitle('Help');
        client.commands.forEach(command => {
            embed.addField(`${prefix}${command.name}`, `${command.description}`, true)
        })
        message.channel.send(embed)
    }

    fs.readFile('./db/users.json', 'utf8', (err, data) => {
        if (err) throw err
        if (data) {
            let usersArr = JSON.parse(data)
            if (usersArr.users.length) {
                var userExistence = false
                usersArr.users.forEach(user => {
                    if (user.username === message.author.tag) {
                        var userCustomStatus = checkUserStatus(message.author)
                        user.userCustomStatus = `${userCustomStatus}`
                        user.userXP++
                        var oldLevel = user.userLevel
                        if (user.userXP >= user.userLevel * 30) {
                            user.userLevel++
                        }
                        if (oldLevel != user.userLevel) {
                            message.channel.send(`<@${message.author.id}> advanced to level ${user.userLevel}!`);
                        }
                        switch (user.userLevel) {
                            case 10:
                                user.userMainStatus = 'unicorn'
                                user.userStatusColor = '#FF4DF8' 
                            break;
                        }
                        fs.writeFile('./db/users.json', JSON.stringify(usersArr), err => {
                            if (err) throw err
                        })
                        userExistence = true
                    }
                })
                if (!userExistence) {
                    usersArr.users.push({
                        "username": message.author.tag,
                        "userXP": 0,
                        "userLevel": 0,
                        "userMainStatus": "user",
                        "userStatusColor": "#4DFF5E",
                        "userCustomStatus": `${userCustomStatus}`,
                        "userRegister": message.author.createdAt
                    })
                    fs.writeFile('./db/users.json', JSON.stringify(usersArr), err => {
                        if (err) throw err
                    })
                }
            } else {
                usersArr.users.push({
                    "username": client.user.tag,
                    "userXP": 0,
                    "userLevel": 10
                })
                fs.writeFile('./db/users.json', JSON.stringify(usersArr), err => {
                    if (err) throw err
                })
            }
        } else {
            fs.writeFile('./db/users.json', '{"users": []}', err => {
                if (err) throw err
            })
        }
    })
})

function levelUpdate(exp) {
    if (exp >= 0 && exp <= 10) return 0
    else if (exp > 10 && exp <= 30) return 1
    else if (exp > 30 && exp <= 60) return 2
    else if (exp > 60 && exp <= 120) return 3
    else if (exp > 120 && exp <= 240) return 4
    else if (exp > 240 && exp <= 480) return 5
    else if (exp > 480 && exp <= 960) return 6
    else if (exp > 480 && exp <= 960) return 7
    else if (exp > 960 && exp <= 1920) return 8
    else if (exp > 1920 && exp <= 3840) return 9
    else if (exp > 3840 && exp <= 7680) return 10
    else return 'god'
}

function checkUserStatus(user) {
    var activityStatus = ''
    user.presence.activities.forEach(activity => {
        if (activity.name === 'Custom Status') {
            if (activity.state !== null) {
                activityStatus = activity.state
            } else {
                activityStatus = ''
            }
        } 
    })
    var userEmoji = checkUserEmoji(user)
    return userEmoji + ' ' + activityStatus 
}

function checkUserEmoji(user) {
    var userEmoji = ''
    user.presence.activities.forEach(activity => {
        if (activity.name === 'Custom Status') {
            if (activity.emoji !== null) {
                userEmoji = activity.emoji.name
            } else {
                userEmoji = ''
            }
        }
    })
    return userEmoji
}

client.login(process.env.TOKEN)


