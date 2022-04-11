const { MessageEmbed, Message, WebhookClient } = require("discord.js");
const { WEBHOOKS } = require("../../Structures/config.json");
const { Error } = require("../../Utilites/Logger");

module.exports = {
    name: "messageDelete",
    /**
     * @param {Message} message 
     */
    execute(message) {
        if(message.author.bot) return;

        const Log = new MessageEmbed().setColor("#36393f")
        .setDescription(`📕 [Сообщение](${message.url}) от ${message.author} было **удалено**.\n
        **Удаленное сообщение:**\n \`\`\`${message.content ? message.content : "None"}\`\`\``.slice(0, 4096));

        if(message.attachments.size >= 1){
            Log.addField(`Прикреплено`, `${message.attachments.map(a => a.url).join(" ")}`, true);
        }

        new WebhookClient({url: WEBHOOKS.MESSAGE_LOG.DELETE_URL})
        .send({embeds: [Log]}).catch((err) => Error(err));
    }
}