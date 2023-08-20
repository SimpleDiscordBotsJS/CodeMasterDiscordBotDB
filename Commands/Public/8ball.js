const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("8ball")
    .setNameLocalizations({ "ru": "шар" })
    .setDescription("🎱 Ask the 8ball a question.")
    .setDescriptionLocalizations({ "ru": "🎱 Задайте вопрос шару." })
    .addStringOption((options) => options
        .setName("question")
        .setNameLocalizations({ "ru": "вопрос" })
        .setDescription("a question")
        .setDescriptionLocalizations({ "ru": "сам вопрос" })
        .setMinLength(4)
        .setMaxLength(512)
        .setRequired(true)
    )
    .setDMPermission(true),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, user } = interaction;
        const question = options.getString("question");

        const images = [
            ["Да.", "https://c.tenor.com/TFhmPga4xEwAAAAC/magic8ball-yes.gif"],
            ["Безусловно", "https://c.tenor.com/eyI116E3kWYAAAAC/yoda-8ball.gif"],
            ["Вне всякого сомнения", "https://c.tenor.com/-0tatbxLQVQAAAAC/yoda-8ball.gif"],
            ["Да, безусловно", "https://c.tenor.com/fc7fywg2oQQAAAAC/yoda-8ball.gif"],
            ["Можно на это рассчитывать", "https://c.tenor.com/8J1uZFp8xMUAAAAC/yoda-8ball.gif"],
            ["Как мне кажется, да.", "https://c.tenor.com/EIAYng3CUf0AAAAC/yoda-8ball.gif"],
            ["Скорее всего", "https://c.tenor.com/EIAYng3CUf0AAAAC/yoda-8ball.gif"],
            ["Выглядит не очень хорошо", "https://c.tenor.com/Ji3GcuKvu1cAAAAC/magic8ball-simpsons.gif"],
            ["Все признаки указывают это", "https://c.tenor.com/mrN4WoxyRE8AAAAC/shaking8ball-stranger-things4.gif"],
            ["Предположения неясны, попробуйте еще раз", "https://c.tenor.com/BokmYoZhr1AAAAAC/yoda-8ball.gif"],
            ["Спросите еще раз позже", "https://c.tenor.com/Voqiq18wUFIAAAAC/yoda-8ball.gif"],
            ["Лучше не спрашивайте сейчас...", "https://c.tenor.com/Voqiq18wUFIAAAAC/yoda-8ball.gif"],
            ["Прогноз сейчас невозможен", "https://c.tenor.com/fs_hXVg58LkAAAAC/yoda-8ball.gif"],
            ["Сконцентрируйтесь и спросите еще раз", "https://c.tenor.com/Voqiq18wUFIAAAAC/yoda-8ball.gif"],
            ["Не стоит на это рассчитывать", "https://c.tenor.com/cw2aa9cnQ6QAAAAC/magic-eight.gif"],
            ["Моё последнее предположение - нет", "https://c.tenor.com/rJ1ioW_FkhUAAAAC/yoda-8ball.gif"],
        ];

        const parsed = images.map((x) => [x[0], x[1]]);
        const random = Math.floor(Math.random() * parsed.length);

        const embed = new EmbedBuilder().setImage(parsed[random][1]).setTimestamp()
        .setColor("DarkBlue").addFields(
            { name: "**Вопрос:**", value: `\`\`\`${question}\`\`\``, inline: true },
            { name: "**Ответ:**", value: `\`\`\`${parsed[random][0]}\`\`\``, inline: true }
        )
        .setFooter({ text: `Спросил: ${user.username}`, iconURL: user.displayAvatarURL({ size: 256 }) });

        interaction.reply({ embeds: [embed] });
    }
}