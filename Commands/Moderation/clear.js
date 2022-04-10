const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "clear",
    description: "Очистить чат.",
    permission: "MANAGE_MESSAGES",
    options: [
        { name: "amount", description: "Количество сообщений, которое вы хотите удалить.",
            type: "NUMBER", required: true
        },
        { name: "target", description: "Пользователь, сообщения которого, вы хотите удалить.",
            type: "USER", required: false
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const { channel, options } = interaction;

        const Amount = options.getNumber("amount");
        const Target = options.getMember("target");

        const Messages = await channel.messages.fetch();

        const Response = new MessageEmbed().setColor("LUMINOUS_VIVID_PINK");

        if(Target) {
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if(m.author.id === Target.id && Amount > i) {
                    filtered.push(m);
                    i++;
                }
            })

            await channel.bulkDelete(filtered, true).then(messages => {
                Response.setDescription(`🧹 Удалено ${messages.size} сообщений от ${Target}`);
                interaction.reply({embeds: [Response], ephemeral: true});
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                Response.setDescription(`🧹 Удалено \`${messages.size}\` сообщений`);
                interaction.reply({embeds: [Response], ephemeral: true});
            })
        }
        return;
    }
}