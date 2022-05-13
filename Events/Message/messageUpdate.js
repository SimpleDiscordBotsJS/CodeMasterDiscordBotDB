const { MessageEmbed, Message, Client } = require("discord.js");

module.exports = {
    name: "messageUpdate",
    /**
     * @param {Message} oldMessage 
     * @param {Message} newMessage 
     * @param {Client} client
     */
    execute(oldMessage, newMessage, client) {
        if(oldMessage.author.bot) return;

        if(oldMessage.content === newMessage.content) return;

        const Count = 1950;

        const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? " ..." : "");
        const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > 1950 ? " ..." : "");
    
        const Log = new MessageEmbed().setColor("#36393f")
        .setDescription(`📘 [Сообщение](${newMessage.url}) было **изменено**.\n
        **Оригинал**: \n \`\`\`${Original}\`\`\` \n**Измененное**:\n \`\`\`${Edited}\`\`\``.slice("0", "4096"))
        .addField(`**Автор**`, `${newMessage.author}`, true)
        .setFooter({text: `Пользователь: ${newMessage.author.tag} | ID: ${newMessage.author.id}`}).setTimestamp();

        if(newMessage.channel.isThread()) {
            Log.addField(`**Ветка**`, `<#${newMessage.channel.id}>`, true);
        } else {
            Log.addField(`**Канал**`, `<#${newMessage.channel.id}>`, true);
        }

        const channelID = client.AuditEditLog.get(newMessage.guild.id);
        if(!channelID) return;
        const channelObject = newMessage.guild.channels.cache.get(channelID);
        if(!channelObject) return;
        createAndDeleteWebhook(channelObject, Log);

        async function createAndDeleteWebhook(channelID, embedName) {
            await channelID.createWebhook("Logs", {
                avatar: client.user.avatarURL({ format: "png" })
            }).then(webhook => {
                webhook.send({
                    embeds: [embedName]
                }).then(() => webhook.delete().catch(() => {}))
            });
        }
    }
}