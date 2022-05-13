const { MessageEmbed, GuildMember } = require("discord.js");
const ms = require("ms");
const DB = require("../../Structures/Schemas/GuildSettingsDB");

module.exports = {
    name: 'guildMemberAdd',
    /**
     * @param {GuildMember} member
     */
    async execute(member) {
        if(member.user.bot) return;
        if(member.user.createdTimestamp < ms('7 day')) {
            await member.kick("Account age is less than 7 day");

            const channelID = client.AntiMultiAccLog.get(guild.id);
            if(!channelID) return;
            const channelObject = guild.channels.cache.get(channelID);
            if(!channelObject) return;
    
            const Embed = new MessageEmbed().setColor("RED").setTitle("Мульти аккаунт!")
            .setAuthor({name: member.user.tag, iconURL: member.user.displayAvatarURL({dynamic: true})})
            .addField("**User**", `\`${member.user.tag}\` (${member.id})`)
            .addField("**Action**", `Kick (Automatic)`, true)
            .addField("**Reason**", `Account age is less than 7 day`, true)
            .setFooter({text: `Guild ID: ${member.user.id}`}).setTimestamp();
    
            await channelObject.send({embeds: [Embed]});
        }
    }
}