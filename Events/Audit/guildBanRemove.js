const { GuildBanManager, EmbedBuilder, WebhookClient } = require("discord.js");

module.exports = {
    name: "guildBanRemove",
    /**
     * @param {GuildBanManager} ban 
     */
    async execute(ban) {
        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_BAN });
        if(!logChannel) return;

        const Embed = new EmbedBuilder()
        .setColor("#70ec46")
        .setTitle("🔨 __**Пользователь разбанен**__ 🔨")
        .setDescription(`**${ban.user.tag}** был успешно разбанен`)
        .addFields(
            { name: `Пользователь`, value: `${ban.user}`, inline: true },
            { name: `Причина`, value: `\`${ban.reason ? ban.reason : "Не указана"}\``, inline: true }
        )
        .setTimestamp();

        channel.send({ embeds: [Embed] });
    }
}