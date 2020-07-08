const { MessageAttachment } = require('discord.js')
const request = require('request')

module.exports = {
    name: 'fox',
    description: 'Send random fox pic 🦊',
    run: async (bot, message, args) => {
        request({
            url: 'https://randomfox.ca/floof/',
            json: true
        }, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                var attachment = new MessageAttachment(body.image)
                message.channel.send(attachment)
            } else {
                message.channel.send('На севодня лисичкав нема :<')
            }
        })
    }
}
