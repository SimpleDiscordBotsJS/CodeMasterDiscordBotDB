const { ThreadChannel, EmbedBuilder, WebhookClient } = require("discord.js");

module.exports = {
    name: "threadCreate",
    /**
     * @param {ThreadChannel} thread 
     */
    async execute(thread) {
        if(thread.type !== "GUILD_NEWS_THREAD" && thread.type !== "GUILD_PUBLIC_THREAD" && thread.type !== "GUILD_PRIVATE_THREAD ") return;

        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_THREAD });
        if(!logChannel) return;
        
        const Embed = new EmbedBuilder()
        .setColor("#70ec46").setTitle("🌳 __**Ветка создана**__ 🌳")
        .setDescription(`${thread} была успешно создана`)
        .addFields(
            { name: `Ветка`, value: `${thread}`, inline: true },
            { name: "Создатель", value: `<@${thread.ownerId}>`, inline: true }
        )
        .setTimestamp();

        logChannel.send({ embeds: [Embed] });
    }
}