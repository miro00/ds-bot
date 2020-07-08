const { MessageAttachment } = require('discord.js')
const request = require('request')

module.exports = {
    name: 'cat',
    description: 'Send random cat pic 😺',
    run: async (bot, message, args) => {
        request({
            url: 'https://aws.random.cat/meow',
            json: true
        }, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                var attachment = new MessageAttachment(body.file)
                message.channel.send(attachment)
            } else {
                message.channel.send('На севодня котикав нема :<')
            }
        })
    }
}

