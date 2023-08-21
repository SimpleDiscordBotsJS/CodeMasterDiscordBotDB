const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("dick-size")
    .setNameLocalizations({ "ru": "размер-пениса" })
    .setDescription("Show penis size.")
    .setDescriptionLocalizations({ "ru": "Показать размер пениса." })
    .addUserOption((options) => options
        .setName("user")
        .setNameLocalizations({ "ru": "пользователь" })
        .setDescription("Show user penis size.")
        .setDescriptionLocalizations({ "ru": "Показать размер пениса пользователя." })
        .setRequired(false)
    )
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, user } = interaction;
        const target = options.getUser("user") || user;

        if(target.bot) return interaction.reply({ content: "Лол, что?", ephemeral: true });

        const size = (user.id.slice(-3) % 20) + 1;
        const Size = size/2.54

        const embed = new EmbedBuilder().setColor("Blurple")
        .setThumbnail(target.avatarURL({ size: 512 }))
        .setAuthor({ name: `${target.displayName}` })
        .setDescription([
            `${Size.toFixed(2)} дюйм(ов)`,
            `8${"=".repeat(size)}D`
        ].join("\n"))
        .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
}