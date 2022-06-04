const { ChannelManager, MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
    name: "channelDelete",
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
    
        const Embed = new MessageEmbed().setColor("#e15050")
        .setTitle("🔰 __**Канал удалён**__ 🔰")
        .setDescription(`**${channel.name}** был успешно удалён`)
        .addField(`Канал`, `\`${channel.name}\``, true)
        .setTimestamp();

        logChannel.send({embeds: [Embed]});
    }
}