const { GuildMember, MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member 
     */
    async execute(member) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_MEMBER });
        if(!logChannel) return;
        
        const Embed = new MessageEmbed().setColor("#70ec46")
        .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()})
        .setTitle("🙂 __**Новый пользователь**__ 🙂")
        .setDescription(`${member} присоединился к серверу`)
        .addField("Пользователь", `${member}`, true)
        .addField("Создан", `${member.user.createdAt}`, true)
        .setTimestamp();

        logChannel.send({embeds: [Embed]});
    }
}