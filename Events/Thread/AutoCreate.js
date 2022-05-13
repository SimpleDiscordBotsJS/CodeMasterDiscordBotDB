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
                for(var c = 0; c < data.AutoThreadCreateChannelsID[c]; ++c) {
                    if(message.guild.channels.cache.get(data.AutoThreadCreateChannelsID[c])) {
                        if(message.channel.id == data.AutoThreadCreateChannelsID[c]) {
                            let Content = message.content;

                            for(var i = 0; i < message.content.length; ++i) {
                                Content = Content.replace("*", "")
                                .replace("_", "").replace("~", "")
                                .replace("`", "").replace("|", "");
                            }

                            await message.startThread({ name: `${Content.substring(0, 50)}...`});
                        }
                    }
                }
            }
        });
    }
}