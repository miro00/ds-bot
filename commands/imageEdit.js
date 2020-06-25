const { MessageAttachment } = require('discord.js')
const request = require('request')

module.exports = {
    'name': 'bruh',
    'description': 'make some bruhhh',
    run: async (bot, message, args) => {
        var avatar = message.author.avatarURL()

    }
}