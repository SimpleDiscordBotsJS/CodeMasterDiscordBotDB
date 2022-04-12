const { Message } = require("discord.js");
const DB = require("../../Structures/Schemas/SocRatingDB");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     */
    async execute(message) {
        if(message.author.bot) return;
        //if(message.channelId == ) - На будущее, с чёрным списком каналов.

        const { guildId, author } = message;

        DB.findOne({GuildID: guildId, MemberID: author.id}, async(err, data) => {
            if(err) throw err;
            if(!data) return DB.create({GuildID: guild.id, MemberID: member.id, Rating: 100});

            data.Rating = data.Rating + 0.001;
            data.save();

            if(data.Rating == 1000) {
                message.guild.systemChannel.send({content: `Пользователь ${author}, только что набрал, 1000 очков социального рейтинга!`});
            }
        });
        return;
    }
}