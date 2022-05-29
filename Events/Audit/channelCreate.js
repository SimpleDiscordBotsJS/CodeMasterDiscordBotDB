const { ChannelManager, MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
    name: "channelCreate",
    /**
     * @param {ChannelManager} channel
     */
    async execute(channel) {
        if(!channel.guild) return;
        if(channel.type === "GUILD_NEWS_THREAD") return;
        if(channel.type === "GUILD_PUBLIC_THREAD") return;
        if(channel.type === "GUILD_PRIVATE_THREAD ") return;

        const logChannel = new WebhookClient({ url: process.env.WEBHOOK_AUDIT_CHANNEL });
        if(!logChannel) return;

        const Embed = new MessageEmbed().setColor("#70ec46")
        .setTitle("🔰 __**Канал создан**__ 🔰")
        .setDescription(`**${channel.name}** был успешно создан`)
        .addField(`Канал`, `${channel}`, true)
        .setTimestamp();

        logChannel.send({embeds: [Embed]});
    }
}