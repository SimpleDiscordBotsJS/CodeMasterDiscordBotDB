const { GuildMember } = require("discord.js");
const DB = require("../../Structures/Schemas/SocRatingDB");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member 
     */
    async execute(member) {
        if(member.user.bot) return;

        const { guild } = member;

        try {
            await DB.findOne({GuildID: guild.id, MemberID: member.id}, async(err, data) => {
                if(err) throw err;
                if(!data) return DB.create({GuildID: guild.id, MemberID: member.id, Rating: 100});
            })
        } catch(err) {
            console.log(err);
        }
    }
}