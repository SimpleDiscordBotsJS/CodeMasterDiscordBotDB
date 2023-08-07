const { EmbedBuilder, GuildMember } = require("discord.js");
const ms = require("ms");
const DB = require("../../Structures/Data/Schemas/AntiMultiAccountDB");

module.exports = {
    name: 'guildMemberAdd',
    /**
     * @param {GuildMember} member
     */
    async execute(member) {
        if(member.user.bot) return;
        if(member.user.createdTimestamp < ms('7 day')) {
            await member.kick("Возраст аккаунта менее семи дней");

            const Data = await DB.findOne({ GuildID: member.guild.id });
            if(!Data) return;
            const ChannelID = member.guild.channels.cache.get(Data.ChannelID);
            if(!ChannelID) return;
    
            const Embed = new EmbedBuilder().setColor("Red").setTitle("__**Мульти аккаунт!**__")
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({dynamic: true}) })
            .addFields(
                { name: "**Пользователь**", value: `\`${member.user.tag}\` (${member.id})` },
                { name: "**Действие**", value: `Kick (Automatic)`, inline: true },
                { name: "**Причина**", value: `Возраст аккаунта менее семи дней!`, inline: true }
            )
            .setFooter({ text: `Guild ID: ${member.user.id}` }).setTimestamp();
    
            await ChannelID.send({ embeds: [Embed] });
        }
    }
}