const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear")
    .setNameLocalizations({ "ru": "очистить" })
    .setDescription("Clear chat.")
    .setDescriptionLocalizations({ "ru": "Очистить чат." })
    .addNumberOption((options) => options
        .setName("amount")
        .setNameLocalizations({ "ru": "количество" })
        .setDescription("Number of messages you want to delete.")
        .setDescriptionLocalizations({ "ru": "Количество сообщений, которое вы хотите удалить." })
        .setRequired(true)
    )
    .addUserOption((options) => options
        .setName("target")
        .setNameLocalizations({ "ru": "цель" })
        .setDescription("The user whose messages you want to delete.")
        .setDescriptionLocalizations({ "ru": "Пользователь, сообщения которого, вы хотите удалить." })
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const { channel, options } = interaction;

        const Amount = options.getNumber("amount");
        const Target = options.getMember("target");

        const Messages = await channel.messages.fetch();

        const Response = new EmbedBuilder().setColor("LuminousVividPink");

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
                interaction.reply({ embeds: [Response], ephemeral: true });
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                Response.setDescription(`🧹 Удалено \`${messages.size}\` сообщений`);
                interaction.reply({ embeds: [Response], ephemeral: true });
            })
        }
        return;
    }
}