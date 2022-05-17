const { MessageEmbed, GuildMember } = require("discord.js");
const ms = require("ms");
const DB = require("../../Structures/Schemas/AntiMultiAccDB");

module.exports = {
    name: 'guildMemberAdd',
    /**
     * @param {GuildMember} member
     */
    async execute(member) {
        if(member.user.bot) return;
        if(member.user.createdTimestamp < ms('7 day')) {
            await member.kick("Возраст аккаунта менее семи дней");

            const Data = await DB.findOne({GuildID: member.guild.id});
            if(!Data) return;
            const ChannelID = member.guild.channels.cache.get(Data.ChannelID);
            if(!ChannelID) return;
    
            const Embed = new MessageEmbed().setColor("RED").setTitle("Мульти аккаунт!")
            .setAuthor({name: member.user.tag, iconURL: member.user.displayAvatarURL({dynamic: true})})
            .addField("**Пользователь**", `\`${member.user.tag}\` (${member.id})`)
            .addField("**Действие**", `Kick (Automatic)`, true)
            .addField("**Прчина**", `Возраст аккаунта менее семи дней!`, true)
            .setFooter({text: `Guild ID: ${member.user.id}`}).setTimestamp();
    
            await ChannelID.send({embeds: [Embed]});
        }
    }
}