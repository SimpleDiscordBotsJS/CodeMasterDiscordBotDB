const { ThreadChannel, MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
    name: "threadDelete",
    /**
     * @param {ThreadChannel} thread 
     */
    async execute(thread) {
        if(thread.type !== "GUILD_NEWS_THREAD" && thread.type !== "GUILD_PUBLIC_THREAD" && thread.type !== "GUILD_PRIVATE_THREAD ") return;

        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_THREAD });
        if(!logChannel) return;
        
        const Embed = new MessageEmbed()
        .setColor("#ea4e4e").setTitle("🌳 __**Ветка удалена**__ 🌳")
        .setDescription(`**${thread.name}** была успешно удалена`)
        .addField(`Ветка`, `\`${thread.name}\``, true)
        .setTimestamp();

        logChannel.send({embeds: [Embed]});
    }
}