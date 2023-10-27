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
        const { user, guild } = member;

        if(user.bot) return;
        if(user.createdTimestamp < ms('7 day')) {
            await member.kick("Возраст аккаунта менее семи дней").catch(e => {
                Error(`[Member/guildMemberAdd] Произошла ошибка при выкидывании пользователя:\n${e}`);
            });;

            const Data = await DB.findOne({ GuildID: guild.id });
            if(!Data) return;
            const ChannelID = await guild.channels.fetch(Data.ChannelID);
            if(!ChannelID) return;
    
            const Embed = new EmbedBuilder().setColor("Red").setTitle("__**Мульти аккаунт!**__")
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ size: 512 }) })
            .addFields(
                { name: "**Пользователь**", value: `\`${user.tag}\` (${member.id})` },
                { name: "**Действие**", value: `Kick (Automatic)`, inline: true },
                { name: "**Причина**", value: `Возраст аккаунта менее семи дней!`, inline: true }
            )
            .setFooter({ text: `Guild ID: ${user.id}` }).setTimestamp();
    
            return await ChannelID.send({ embeds: [Embed] }).catch(e => {
                return Error(`[Detection/MultiAccountDetection] Произошла ошибка при отправке:\n${e}`);
            });
        }
    }
}