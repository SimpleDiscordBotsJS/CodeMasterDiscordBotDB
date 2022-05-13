const { Message } = require("discord.js");
const DB = require("../../Structures/Schemas/GuildSettingsDB");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     */
    async execute(message) {
        if(message.author.bot) return;

        DB.findOne({GuildID: message.guild.id}, async(err, data) => {
            if(err) throw err;
            if(!data) {
                DB.create({GuildID: message.guild.id});
            } else {
                for(var i = 0; i < data.AutoResponderChannelsID[i]; ++i) {
                    if(message.guild.channels.cache.get(data.AutoResponderChannelsID[i])) {
                        if(message.channel.id == data.AutoResponderChannelsID[i]) {
                            await message.react("👍").then(() => message.react("👎"));
                        }
                    }
                }
            }
        });
    }
}