const { GuildScheduledEventManager, GuildMember, EmbedBuilder, WebhookClient, Client } = require("discord.js");

module.exports = {
    name: "guildScheduledEventUserRemove",
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

        const Embed = new EmbedBuilder().setColor("#ea4e4e").setTitle("🎊 __**Пользователь удалён из ивента**__ 🎊")
        .setDescription(`**${guildScheduledEvent.name}** Пользователь успешно удалён из ивента`)
        .addFields(
            { name: "Ивент", value: `\`${guildScheduledEvent.name}\``, inline: true },
            { name: "Пользователь", value: `${user}`, inline: true }
        )
        .setTimestamp();

        webhook.send({ embeds: [Embed] });
    }
}