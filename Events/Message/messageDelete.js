const { MessageEmbed, Message, Client } = require("discord.js");

module.exports = {
    name: "messageDelete",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    execute(message, client) {
        if(message.author.bot) return;

        //Игнорируем, если сообщение, в юриздикции Anti-Scam
        //Чтобы не было ненужного сообщения
        const Filter = require(`../../Structures/Validation/ScamLinks.json`);
        const ScamFilter = Filter.some((Word) => message.content.toLowerCase().split(" ").includes(Word.toLowerCase()));
        if(ScamFilter) return;

        //Всё остальное
        const Log = new MessageEmbed().setColor("#36393f")
        .setDescription(`📕 [Сообщение](${message.url}) было **удалено**.\n
        **Удаленное сообщение:**\n \`\`\`${message.content ? message.content : "None"}\`\`\``.slice(0, 4096))
        .addField(`**Автор**`, `${message.author}`, true)
        .setFooter({text: `Пользователь: ${message.author.tag} | ID: ${message.author.id}`}).setTimestamp();

        if(message.channel.isThread()) {
            Log.addField(`**Ветка**`, `<#${message.channel.id}>`, true);
        } else {
            Log.addField(`**Канал**`, `<#${message.channel.id}>`, true);
        }

        if(message.attachments.size >= 1){
            Log.addField(`Прикреплено`, `${message.attachments.map(a => a.url).join(" ")}`, true);
        }

        const channelID = client.AuditDeleteLog.get(message.guild.id);
        if(!channelID) return;
        const channelObject = message.guild.channels.cache.get(channelID);
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