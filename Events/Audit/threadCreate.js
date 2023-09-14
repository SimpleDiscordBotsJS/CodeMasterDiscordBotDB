const { ThreadChannel, EmbedBuilder, WebhookClient, Client } = require("discord.js");

module.exports = {
    name: "threadCreate",
    /**
     * @param {ThreadChannel} thread
     * @param {Client} client
     */
    async execute(thread, client) {
        if(thread.type !== "GUILD_NEWS_THREAD" && thread.type !== "GUILD_PUBLIC_THREAD" && thread.type !== "GUILD_PRIVATE_THREAD ") return;

        const webHookData = await client.webHooks.get(guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_THREAD_WEBHOOK;
        if(!(WebHookID || WebHookToken)) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });
        
        const Embed = new EmbedBuilder()
        .setColor("#70ec46").setTitle("🌳 __**Ветка создана**__ 🌳")
        .setDescription(`${thread} была успешно создана`)
        .addFields(
            { name: `Ветка`, value: `${thread}`, inline: true },
            { name: "Создатель", value: `<@${thread.ownerId}>`, inline: true }
        )
        .setTimestamp();

        webhook.send({ embeds: [Embed] });
    }
}