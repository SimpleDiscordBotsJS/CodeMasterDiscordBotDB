const { GuildBanManager, EmbedBuilder, WebhookClient, Client } = require("discord.js");

module.exports = {
    name: "guildBanRemove",
    /**
     * @param {GuildBanManager} ban
     * @param {Client} client
     */
    async execute(ban, client) {
        const webHookData = await client.webHooks.get(guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_BAN_WEBHOOK;
        if(!(WebHookID || WebHookToken)) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });

        const Embed = new EmbedBuilder()
        .setColor("#70ec46")
        .setTitle("🔨 __**Пользователь разбанен**__ 🔨")
        .setDescription(`**${ban.user.tag}** был успешно разбанен`)
        .addFields(
            { name: `Пользователь`, value: `${ban.user}`, inline: true },
            { name: `Причина`, value: `\`${ban.reason ? ban.reason : "Не указана"}\``, inline: true }
        )
        .setTimestamp();

        webhook.send({ embeds: [Embed] });
    }
}