const { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { repAdd } = require("../../Structures/Utilities/RepUtilities");

module.exports = {
    cooldown: 30000,
    data: new SlashCommandBuilder()
    .setName("rep")
    .setNameLocalizations({ "ru": "благодарность" })
    .setDescription("To say thank you.")
    .setDescriptionLocalizations({ "ru": "Выразить благодарность." })
    .addUserOption((user) => user
        .setName("user")
        .setNameLocalizations({ "ru": "пользователь" })
        .setDescription("The user you want to thank.")
        .setDescriptionLocalizations({ "ru": "Пользователь, которого хотите поблагодарить." })
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

        await repAdd(guild.id, target.id, 2);

        //Успешный тыбзинг текста из гравит
        interaction.reply({ embeds: [new EmbedBuilder()
            .setDescription(`\`•\` Пользователь ${user} говорит спасибо ${target}`)
            .setColor("#36393f").addFields(
                { name: "Репутация:", value: `Репутация пользователя увеличена на: \`\`${2}\`\``, inline: false },
                { name: "Как сказать спасибо?", value: `\`\`\`/rep\`\`\``, inline: false }
            ).setTimestamp()
        ]});
    }
}