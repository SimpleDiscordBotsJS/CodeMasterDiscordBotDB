const { GuildScheduledEventManager, GuildMember, EmbedBuilder, WebhookClient, Client } = require("discord.js");

module.exports = {
    name: "guildScheduledEventUserAdd",
    /**
     * @param {GuildScheduledEventManager} guildScheduledEvent
     * @param {GuildMember} user
     * @param {Client} client
     */
    async execute(guildScheduledEvent, user, client) {
        const webHookData = await client.webHooks.get(guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_EVENT_WEBHOOK;
        if(!(WebHookID || WebHookToken)) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });

        const Embed = new EmbedBuilder().setColor("#70ec46").setTitle("🎊 __**Пользователь добавлен в ивент**__ 🎊")
        .setDescription(`\`•\` **${guildScheduledEvent.name}** Пользователь успешно добавлен в ивент`)
        .addFields(
            { name: "Ивент", value: `\`${guildScheduledEvent.name}\``, inline: true },
            { name: "Пользователь", value: `${user}`, inline: true }
        )
        .setTimestamp();

        webhook.send({ embeds: [Embed] });
    }
}