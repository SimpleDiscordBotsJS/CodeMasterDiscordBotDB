const { MessageEmbed, Message, WebhookClient } = require("discord.js");

module.exports = {
    name: "messageDelete",
    /**
     * @param {Message} message
     */
    async execute(message) {
        if(message.author.bot) return;

        //Игнорируем, если сообщение, в юрисдикции Anti-Scam
        //Чтобы не было ненужного сообщения
        const Filter = require(`../../Structures/Validation/ScamLinks.json`);
        const ScamFilter = Filter.some((Word) => message.content.toLowerCase().split(" ").includes(Word.toLowerCase()));
        if(ScamFilter) return;

        //Проверка на наличие вебхука
        const logChannel = new WebhookClient({url: process.env.WEBHOOK_MESSAGE_DELETE});
        if(!logChannel) return;

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

        return logChannel.send({embeds: [Log]});
    }
}