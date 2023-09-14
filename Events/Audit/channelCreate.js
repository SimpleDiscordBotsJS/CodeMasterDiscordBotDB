const { ChannelManager, EmbedBuilder, WebhookClient, Client } = require("discord.js");

module.exports = {
    name: "channelCreate",
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

        const Embed = new EmbedBuilder().setColor("#70ec46")
        .setTitle("🔰 __**Канал создан**__ 🔰")
        .setDescription(`**${channel.name}** был успешно создан`)
        .addFields({ name: `Канал`, value: `${channel}`, inline: true })
        .setTimestamp();

        webhook.send({ embeds: [Embed] });
    }
}