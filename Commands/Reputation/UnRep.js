const { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { repRemove } = require("../../Structures/Utilities/RepUtilities");

module.exports = {
    cooldown: 30000,
    data: new SlashCommandBuilder()
    .setName("unrep")
    .setNameLocalizations({ "ru": "неодобрение" })
    .setDescription("To say a man is bad.")
    .setDescriptionLocalizations({ "ru": "Выразить неодобрение." })
    .addUserOption((user) => user
        .setName("user")
        .setNameLocalizations({ "ru": "пользователь" })
        .setDescription("The user you want to disapprove of.")
        .setDescriptionLocalizations({ "ru": "Пользователь, которому хотите выразить неодобрение." })
        .setRequired(true)
    )
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, options, user } = interaction;
        const target = options.getUser("user");

        if(user.id === target.id) return interaction.reply({ content: "Нельзя использовать на себе!", ephemeral: true });
        if(target.bot) return interaction.reply({ content: "Lol, what?", ephemeral: true });

        await repRemove(guild.id, target.id, 3);

        //Успешный тыбзинг текста из гравит
        interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`\`•\` Пользователь ${user} выражает неодобрение ${target}`)
            .setColor("#36393f").addFields(
                { name: "Репутация:", value: `Репутация пользователя уменьшена на: \`\`3\`\``, inline: false },
                { name: "Как выразить неодобрение?", value: `\`\`\`/unrep\`\`\``, inline: false }
            ).setTimestamp()
        ]});
    }
}