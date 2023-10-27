const { Channel, EmbedBuilder, WebhookClient, Client, ChannelType } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");

module.exports = {
    name: "channelDelete",
    /**
     * @param {Channel} channel
     * @param {Client} client
     */
    async execute(channel, client) {
        if(!channel.guild) return;
        if(channel.type === (ChannelType.PrivateThread || ChannelType.PublicThread)) return;
    
        const webHookData = await client.webHooks.get(channel.guild.id);
        if(!webHookData) return;

        const { WebHookID, WebHookToken } = webHookData.AUDIT_CHANNEL_WEBHOOK;
        if(!WebHookID || !WebHookToken) return;

        const webhook = new WebhookClient({ id: WebHookID, token: WebHookToken });
    
        const Embed = new EmbedBuilder().setColor("#e15050")
        .setTitle("🔰 __**Канал удалён**__ 🔰")
        .setDescription(`\`•\` **${channel.name}** был успешно удалён`)
        .addFields({ name: `Канал`, value: `\`${channel.name}\``, inline: true })
        .setTimestamp();

        webhook.send({ embeds: [Embed] }).catch(e => {
            return Error(`[Audit/channelDelete] Произошла ошибка при отправке:\n${e}`);
        });
    }
}