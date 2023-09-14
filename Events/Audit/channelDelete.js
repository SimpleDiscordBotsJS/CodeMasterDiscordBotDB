const { ChannelManager, EmbedBuilder, WebhookClient, Client } = require("discord.js");

module.exports = {
    name: "channelDelete",
    /**
     * @param {ChannelManager} channel
     * @param {Client} client
     */
    async execute(channel, client) {
        if(!channel.guild) return;
        if(channel.type === "GUILD_NEWS_THREAD") return;
        if(channel.type === "GUILD_PUBLIC_THREAD") return;
        if(channel.type === "GUILD_PRIVATE_THREAD ") return;
    
        const webHookData = await client.webHooks.get(guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_CHANNEL_WEBHOOK;
        if(!(WebHookID || WebHookToken)) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });
    
        const Embed = new EmbedBuilder().setColor("#e15050")
        .setTitle("🔰 __**Канал удалён**__ 🔰")
        .setDescription(`**${channel.name}** был успешно удалён`)
        .addFields({ name: `Канал`, value: `\`${channel.name}\``, inline: true })
        .setTimestamp();

        webhook.send({ embeds: [Embed] });
    }
}