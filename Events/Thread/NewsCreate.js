const { Message } = require("discord.js");
const { NEWS_THREAD_CREATE_TO_CHANNELS } = require("../../Structures/config.json");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     */
    async execute(message) {
        NEWS_THREAD_CREATE_TO_CHANNELS.forEach(async (channel) => {
            if(!message.guild.channels.cache.get(channel)) return;
            if(message.channel.id != channel) return;

            let name = `${new Date().getHours()}.${new Date().getMinutes()} - ${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`;

            await message.startThread({ name: name });
        });
    }
}