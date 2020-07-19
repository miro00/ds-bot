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
		fs.readFile('./db/users.json', (err, data) => {
			if (err) throw err
			var usersArr = JSON.parse(data).users
			usersArr.forEach(usr => {
				if (usr.username === message.author.tag) {
					var progress = (Math.round((usr.userXP / (usr.userLevel * 30)) * 100) / 100) * 200
					// var userRegister = new Date(usr.userRegister)
					// var userRegisterDate = userRegister.getDate() < 10 ? '0' + userRegister.getDate() : userRegister.getDate()
					// var userRegisterMonth = userRegister.getMonth() + 1 < 10 ? '0' + (userRegister.getMonth() + 1) : userRegister.getMonth() + 1
					var member = message.mentions.members.first() || message.member
					var timeOnServer = new Date(member.joinedAt)
					// var timeOnServerDate = timeOnServer.getDate() < 10 ? '0' + timeOnServer.getDate() : timeOnServer.getDate()
					// var timeOnServerMonth = timeOnServer.getMonth() + 1 < 10 ? '0' + (timeOnServer.getMonth() + 1) : timeOnServer.getMonth() + 1 
					var today = new Date()
					var daysOnServer = Math.ceil(Math.abs(today.getTime() - timeOnServer.getTime()) / (1000 * 3600 * 24))
					Canvas.registerFont("./fonts/Montserrat-Bold.ttf", "Montserrat")
					var image = new Canvas(400, 150)
						//Background image
						.addImage('./bg.png', 0, 0)
						//Panel bg
						.setColor('rgba(65, 113, 169, 0.6)')
						.addBeveledRect(140, 14, 238, 106)
						//Avatar
						.setColor('#65ACFF')
						.addBeveledRect(21, 8, 134, 134, 4)
						.addImage(avatar, 24, 11)
						//Username
						.setColor('#ffffff')
						.setTextFont('18px Montserrat')
						.addText(message.author.username, 164, 40)
						//User Status
						.setTextSize(12)
						.setColor('#183960')
						.addText(usr.userCustomStatus || '', 164, 60)
						.setColor(usr.userStatusColor)
						//User Main Status
						.addBeveledRect(164, 94, 80, 20, 4)
						.setColor('#202020')
						.setTextAlign('center')
						.setTextSize(10)
						.addText(usr.userMainStatus, 204, 108)
						//Registration Date
						.setColor('rgb(65, 113, 169)')
						.setTextAlign('start')
						.addText(`Дней на сервере: ${daysOnServer}`, 164, 136)
						//Lvl
						.setTextSize(20)
						.setTextAlign('start')
						.setColor('#ffffff')
						.setTextAlign('right')
						.addText(`LVL ${usr.userLevel}`, 360, 108)
						//Progress Bar
						.setColor('#2763BE')
						.addBeveledRect(164, 69, 200, 16, 12)
						.setColor('#65ACFF')
						.addBeveledRect(164, 69, progress, 16, 12)
						//Xp
						.setColor('#ffffff')
						.setTextAlign('center')
						.setTextSize(12)
						.addText(`XP ${usr.userXP} / ${usr.userLevel * 30}`, 264, 82, 200)
						.toBuffer();

					const attachment = new MessageAttachment(image)
					message.channel.send(attachment)
				}
			});
		})
	}
}