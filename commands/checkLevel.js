const { MessageAttachment } = require('discord.js')
const fetch = require('node-fetch')
const { Canvas } = require('canvas-constructor')
const fs = require('fs')

module.exports = {
    'name': 'xp',
    'description': 'check ur lvl',
    run: async (bot, message, args) => {
        const user = message.mentions.users.first() || message.author
        const result = await fetch(user.displayAvatarURL().replace(".webp", ".png"))
        if (!result.ok) throw new Error("Failed to get the avatar")
        const avatar = await result.buffer()
        await fs.readFile('./db/users.json', (err, data) => {
            if (err) throw err
            var usersArr = JSON.parse(data).users
            usersArr.forEach(usr => {
                if (usr.username === message.author.tag) {
                    var progress = (Math.round((usr.userXP / (usr.userLevel * 30)) * 100) / 100) * 200
                    Canvas.registerFont("./fonts/Montserrat-Bold.ttf", "Montserrat")
                    var image = new Canvas(400, 150)
                        .addImage('./bg.png', 0, 0)                     
                        .setColor('rgba(65, 113, 169, 0.6)')
                        .addBeveledRect(140, 22, 238, 106)
                        .setColor('#65ACFF')
                        .addBeveledRect(21, 8, 134, 134, 4)
                        .addImage(avatar, 24, 11)
                        .setColor('#ffffff')
                        .setTextFont('18px Montserrat')
                        .addText(message.author.username, 164, 48)
                        .setTextSize(12)
                        .setColor('#183960')
                        .addText(usr.userCustomStatus, 164, 68)
                        .setColor(usr.userStatusColor)
                        .addBeveledRect(164, 102, 80, 20, 4)
                        .setColor('#202020')
                        .setTextAlign('center')
                        .setTextSize(10)
                        .addText(usr.userMainStatus, 204, 116)
                        .setTextSize(20)
                        .setTextAlign('start')
                        .setColor('#ffffff')
                        .setTextAlign('right')
                        .addText(`LVL ${usr.userLevel}`, 360, 116)
                        .setColor('#2763BE')
                        .addBeveledRect(164, 77, 200, 16, 12)
                        .setColor('#65ACFF')
                        .addBeveledRect(164, 77, progress, 16, 12)
                        .setColor('#ffffff')
                        .setTextAlign('center')
                        .setTextSize(12)
                        .addText(`XP ${usr.userXP} / ${usr.userLevel * 30}`, 264, 90, 200)
                        .toBuffer();

                    const attachment = new MessageAttachment(image)
                    message.channel.send(attachment)
                }
            });
        })
    }
}