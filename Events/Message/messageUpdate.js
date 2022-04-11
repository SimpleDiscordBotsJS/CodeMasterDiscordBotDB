const { MessageEmbed, Message, WebhookClient } = require("discord.js");
const { WEBHOOKS } = require("../../Structures/config.json");
const { Error } = require("../../Utilites/Logger");

module.exports = {
    name: "messageUpdate",
    /**
     * @param {Message} oldMessage 
     * @param {Message} newMessage 
     */
    execute(oldMessage, newMessage) {
        if(oldMessage.author.bot) return;

        if(oldMessage.content === newMessage.content) return;

        const Count = 1950;

        const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? " ..." : "");
        const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > 1950 ? " ..." : "");
    
        const Log = new MessageEmbed().setColor("#36393f")
        .setDescription(`📘 [Сообщение](${newMessage.url}) от ${newMessage.author} было **изменено** в ${newMessage.channel}.\n
        **Оригинал**: \n \`\`\`${Original}\`\`\` \n**Измененное**:\n \`\`\`${Edited}\`\`\``.slice("0", "4096"))
        .setFooter({text: `Member: ${newMessage.author.tag} | ID: ${newMessage.author.id}`}).setTimestamp();

        new WebhookClient({url: WEBHOOKS.MESSAGE_LOG.EDIT_URL})
        .send({embeds: [Log]}).catch((err) => Error(err));
    }
}