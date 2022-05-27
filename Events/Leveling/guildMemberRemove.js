const { GuildMember } = require("discord.js");
const DB = require("../../Structures/Schemas/Leveling/LevelingDB");

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} member 
     */
    async execute(member) {
        if(member.user.bot) return;

        DB.findOneAndDelete({ GuildID: member.guild.id, UserID: member.user.id });

        return;
    }
}