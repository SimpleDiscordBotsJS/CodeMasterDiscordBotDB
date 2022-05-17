const { Message } = require("discord.js");
const { CREATE_THREAD_TO_CHANNELS } = require("../../Structures/config.json");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     */
    async execute(message) {
        if(message.author.bot) return;

        CREATE_THREAD_TO_CHANNELS.forEach(async (channel) => {
            if(!message.guild.channels.cache.get(channel)) return;
            if(message.channel.id != channel) return;

            let Content = message.content;

            for(var i = 0; i < message.content.length; ++i) {
                Content = Content.replace("*", "").replace("_", "").replace("~", "").replace("`", "").replace("|", "")
            }

            await message.startThread({ name: `${Content.substring(0, 50)}...`});
        });
    }
}