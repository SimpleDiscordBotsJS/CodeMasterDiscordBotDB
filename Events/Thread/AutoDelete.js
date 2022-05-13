const { ThreadChannel } = require("discord.js");
const DB = require("../../Structures/Schemas/GuildSettingsDB");

module.exports = {
    name: "threadCreate",
    /**
     * @param {ThreadChannel} thread 
     */
    async execute(thread) {
        DB.findOne({GuildID: thread.guild.id}, async(err, data) => {
            if(err) throw err;
            if(!data) {
                DB.create({GuildID: thread.guild.id});
            } else {
                for(var i = 0; i < data.AutoThreadDeleteChannelsID[i]; ++i) {
                    if(thread.guild.channels.cache.get(data.AutoThreadDeleteChannelsID[i])) {
                        if(thread.parent.id == data.AutoThreadDeleteChannelsID[i]) {
                            await thread.delete();
                        }
                    }
                }
            }
        });
    }
}