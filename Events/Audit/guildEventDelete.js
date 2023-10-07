const { GuildScheduledEventManager, EmbedBuilder, WebhookClient, Client } = require("discord.js");

module.exports = {
    name: "guildScheduledEventDelete",
    /**
     * @param {GuildScheduledEventManager} guildScheduledEvent
     * @param {Client} client
     */
    async execute(guildScheduledEvent, client) {
        const webHookData = await client.webHooks.get(guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_EVENT_WEBHOOK;
        if(!(WebHookID || WebHookToken)) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });
        
        const Embed = new EmbedBuilder().setColor("#ea4e4e").setTitle("🎊 __**Ивент удалён**__ 🎊")
        .setDescription(`\`•\` **${guildScheduledEvent.name}** был успешно удалён: ${guildScheduledEvent.description}`)
        .addFields(
            { name: "Тип ивента", value: `\`${guildScheduledEvent.type}\``, inline: true },
            { name: "Создатель", value: `${guildScheduledEvent.creator}`, inline: true },
            { name: "Начало", value: `<t:${parseInt(guildScheduledEvent.scheduledStartAt / 1000)}:R>`, inline: true },
            { name: "Окончание", value: `<t:${parseInt(guildScheduledEvent.scheduledEndAt / 1000)}:R>`, inline: true }
        )
        .setTimestamp();

        if(guildScheduledEvent.channel) {
            Embed.addFields({ name: "Канал", value: `${guildScheduledEvent.channel}`, inline: true });
        }

        webhook.send({ embeds: [Embed] });
    }
}