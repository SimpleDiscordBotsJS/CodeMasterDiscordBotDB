const { EmbedBuilder, GuildMember } = require("discord.js");
const ms = require("ms");
const DB = require("../../Structures/Data/Schemas/AntiMultiAccountDB");
const { Error } = require("../../Structures/Utilities/Logger");

module.exports = {
    name: 'guildMemberAdd',
    /**
     * @param {GuildMember} member
     */
    async execute(member) {
        if(member.user.bot) return;
        if(member.user.createdTimestamp < ms('7 day')) {
            await member.kick("Возраст аккаунта менее семи дней").catch(e => {
                Error(`[Member/guildMemberAdd] Произошла ошибка при выкидывании пользователя:\n${e}`);
            });;

            const Data = await DB.findOne({ GuildID: member.guild.id });
            if(!Data) return;
            const ChannelID = member.guild.channels.cache.get(Data.ChannelID);
            if(!ChannelID) return;
    
            const Embed = new EmbedBuilder().setColor("Red").setTitle("__**Мульти аккаунт!**__")
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ size: 512 }) })
            .addFields(
                { name: "**Пользователь**", value: `\`${member.user.tag}\` (${member.id})` },
                { name: "**Действие**", value: `Kick (Automatic)`, inline: true },
                { name: "**Причина**", value: `Возраст аккаунта менее семи дней!`, inline: true }
            )
            .setFooter({ text: `Guild ID: ${member.user.id}` }).setTimestamp();
    
            return await ChannelID.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Detection/MultiAccountDetection] Произошла ошибка при отправке:\n${e}`);
            });
        }
    }
}