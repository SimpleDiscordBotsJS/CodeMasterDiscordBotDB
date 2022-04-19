const { Message } = require("discord.js");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     */
    async execute(message) {
        if(message.author.bot) return;

        if(message.channelId == "962053378584752178") {
            await message.react("👍").then(() => message.react('👎'));
            return;
        }
    }
}