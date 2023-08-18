const { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { repAdd, repRemove } = require("../../Structures/Utilities/RepUtilities");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("rep-set")
    .setNameLocalizations({ "ru": "изменить-репутацию" })
    .setDescription("Change a user's reputation.")
    .setDescriptionLocalizations({ "ru": "Изменить репутацию пользователю." })
    .addSubcommand((options) => options
        .setName("add")
        .setNameLocalizations({ "ru": "добавить" })
        .setDescription("Add a positive reputation.")
        .setDescriptionLocalizations({ "ru": "Добавить положительной репутации." })
        .addUserOption((user) => user
            .setName("user")
            .setNameLocalizations({ "ru": "пользователь" })
            .setDescription("The user to whom you want to add a reputation.")
            .setDescriptionLocalizations({ "ru": "Пользователь, которому хотите добавить репутацию." })
            .setRequired(true)
        )
        .addNumberOption((number) => number
            .setName("amount")
            .setNameLocalizations({ "ru": "количество" })
            .setDescription("The amount of reputation you want to add.")
            .setDescriptionLocalizations({ "ru": "Количество репутации, которое вы хотите добавить." })
            .setRequired(true)
        )
    )
    .addSubcommand((options) => options
        .setName("remove")
        .setNameLocalizations({ "ru": "убрать" })
        .setDescription("Add a negative reputation.")
        .setDescriptionLocalizations({ "ru": "Добавить отрицательной репутации." })
        .addUserOption((user) => user
            .setName("user")
            .setNameLocalizations({ "ru": "пользователь" })
            .setDescription("The user to whom you want to remove a reputation.")
            .setDescriptionLocalizations({ "ru": "Пользователь, которому хотите убрать репутацию." })
            .setRequired(true)
        )
        .addNumberOption((number) => number
            .setName("amount")
            .setNameLocalizations({ "ru": "количество" })
            .setDescription("The amount of reputation you want to remove.")
            .setDescriptionLocalizations({ "ru": "Количество репутации, которое вы хотите убрать." })
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, options, user } = interaction;
        const subCommand = options.getSubcommand();
        const target = options.getUser("user");
        const amount = options.getNumber("amount");

        if(user.bot) return interaction.reply({ content: "Lol, what?", ephemeral: true });

        switch(subCommand) {
            case "add" : {
                await repAdd(guild, target, amount);

                interaction.reply({ embeds: [new EmbedBuilder()
                    .setDescription("Репутация успешно добавлена")
                    .setColor("Green").addFields(
                        { name: "Добавлено:", value: `\`\`\`${amount}\`\`\``, inline: true }
                    ).setTimestamp()
                ], ephemeral: true });
            }
            break;
            case "remove" : {
                await repRemove(guild, target, amount);

                interaction.reply({ embeds: [new EmbedBuilder()
                    .setDescription("Репутация успешно уменьшена")
                    .setColor("Green").addFields(
                        { name: "Уменьшено на:", value: `\`\`\`${amount}\`\`\``, inline: true }
                    ).setTimestamp()
                ], ephemeral: true });
            }
            break;
        }
    }
}