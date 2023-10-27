const { Channel, EmbedBuilder, WebhookClient, Client, ChannelType } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");

module.exports = {
    name: "channelCreate",
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

        const Embed = new EmbedBuilder().setColor("#70ec46")
        .setTitle("🔰 __**Канал создан**__ 🔰")
        .setDescription(`\`•\` **${channel.name}** был успешно создан`)
        .addFields({ name: `Канал`, value: `${channel}`, inline: true })
        .setTimestamp();

        webhook.send({ embeds: [Embed] }).catch(e => {
            return Error(`[Audit/channelCreate] Произошла ошибка при отправке:\n${e}`);
        });
    }
}