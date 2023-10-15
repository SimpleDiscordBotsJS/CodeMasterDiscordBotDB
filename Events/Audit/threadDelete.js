const { ThreadChannel, EmbedBuilder, WebhookClient, Client } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");

module.exports = {
    name: "threadDelete",
    /**
     * @param {ThreadChannel} thread
     * @param {Client} client
     */
    async execute(thread, client) {
        if(thread.type !== "GUILD_NEWS_THREAD" && thread.type !== "GUILD_PUBLIC_THREAD" && thread.type !== "GUILD_PRIVATE_THREAD ") return;

        const webHookData = await client.webHooks.get(thread.guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_THREAD_WEBHOOK;
        if(!WebHookID || !WebHookToken) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });
        
        const Embed = new EmbedBuilder()
        .setColor("#ea4e4e").setTitle("🌳 __**Ветка удалена**__ 🌳")
        .setDescription(`\`•\` **${thread.name}** была успешно удалена`)
        .addFields({ name: `Ветка`, value: `\`${thread.name}\``, inline: true })
        .setTimestamp();

        webhook.send({ embeds: [Embed] }).catch(e => {
            return Error(`[Audit/threadDelete] Произошла ошибка при отправке:\n${e}`);
        });
    }
}