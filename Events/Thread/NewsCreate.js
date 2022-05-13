const { Message, Client } = require("discord.js");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     * @param {Client} client
     */
    async execute(message, client) {
        const channelID = client.NewsThreadChannel.get(message.guild.id);
        if(!channelID) return;

        if(!message.guild.channels.cache.get(channelID)) return;
        if(message.channel.id != channelID) return;

        let name = `${new Date().getHours()}.${new Date().getMinutes()} - ${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}`;

        await message.startThread({ name: name });
    }
}