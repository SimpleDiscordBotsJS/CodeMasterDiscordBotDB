const { Message } = require("discord.js");
const { AUTORESPONDER } = require("../../Structures/config.json");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     */
    async execute(message) {
        if(message.author.bot) return;

        // TODO - Раз уж есть антикраш, пока пусть так, а вообще, надо бы проверять, есть ли канал в гилде. Потом сделаю.

        await AUTORESPONDER.forEach((channels) => {
            if(message.channel.id != channels) return;
            message.react("👍").then(() => message.react("👎"));
        });
    }
}