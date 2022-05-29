const { GuildBanManager, MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildBanRemove",
    /**
     * @param {GuildBanManager} ban 
     */
    async execute(ban) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_BAN });
        if(!logChannel) return;

        const Embed = new MessageEmbed()
        .setColor("#70ec46")
        .setTitle("🔨 __**Пользователь разбанен**__ 🔨")
        .setDescription(`**${ban.user.tag}** был успешно разбанен`)
        .addField(`Пользователь`, `${ban.user}`, true)
        .addField(`Причина`, `${ban.reason ? ban.reason : "Не указана"}`, true)
        .setTimestamp();

        channel.send({embeds: [Embed]});
    }
}