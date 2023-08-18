const { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { getData } = require("../../Structures/Utilities/RepUtilities");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reputation")
    .setNameLocalizations({ "ru": "репутация" })
    .setDescription("Show reputation.")
    .setDescriptionLocalizations({ "ru": "Показать репутацию." })
    .addUserOption((options) => options
        .setName("user")
        .setNameLocalizations({ "ru": "пользователь" })
        .setDescription("Show user reputation.")
        .setDescriptionLocalizations({ "ru": "Показать репутацию пользователя." })
        .setRequired(false)
    )
    .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, options, user } = interaction;
        const target = options.getUser("user") || user;

        if(target.bot) return interaction.reply({ content: "Lol, what?", ephemeral: true });

        const data = await getData(guild.id, target.id);

        const repPositive = data.Reputation.Positive;
        const repNegative = data.Reputation.Negative;

        const embed = new EmbedBuilder().setColor("Aqua")
        .setThumbnail(target.avatarURL({ size: 512 }))
        .setAuthor({ name: `${target.displayName}` })
        .setDescription(`Текущая репутация пользователя: \`\`${repPositive + repNegative}\`\``)
        .addFields(
            { name: "Положительная", value: `\`\`\`${repPositive}\`\`\``, inline: true },
            { name: "Отрицательная", value: `\`\`\`${repNegative}\`\`\``, inline: true }
        )
        .setTimestamp();

        interaction.reply({ embeds: [embed], ephemeral: false });
    }
}