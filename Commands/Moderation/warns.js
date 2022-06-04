const { CommandInteraction, MessageEmbed, MessageButton } = require("discord.js");
const DB = require("../../Structures/Schemas/Moderation/WarningDB");
const paginationEmbed = require("../../Utilities/Pagination");

module.exports = {
    name: "warns",
    nameLocalizations: {
        "ru": "преды"
    },
    description: "Show warnings",
    descriptionLocalizations: {
        "ru": "Показать предупреждения"
    },
    cooldown: 10000, 
    options: [{ 
        name: "target",
        nameLocalizations: {
            "ru": "пользователь"
        },
        description: "Select target",
        descriptionLocalizations: {
            "ru": "Выбрать пользователя"
        },
        type: "USER", required: false 
    }],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guild } = interaction;
        const Target = options.getMember("target") || interaction.member;

        if(Target.user.bot)
        return interaction.reply({embeds: [new MessageEmbed().setColor("RED")
        .setDescription(`Откуда у бота предупреждения?`).setTimestamp()], ephemeral: true});

        const warning = await DB.findOne({ GuildID: guild.id, UserID: Target.id });

        if(!warning || warning.Content.length <= 0) {
            return interaction.reply({ embeds: [new MessageEmbed()
                .setTitle("⚠️ __**WARNINGS**__ ⚠️").setColor("#2f3136").setTimestamp()
                .setDescription(`${Target.user} не имеет предупреждений.`)
            ], ephemeral: true });
        }

        const button1 = new MessageButton()
        .setCustomId("previous-button")
        .setLabel("Previous")
        .setStyle("SECONDARY")
        .setDisabled(true);

        const button2 = new MessageButton()
        .setCustomId("next-button")
        .setLabel("Next")
        .setStyle("PRIMARY");

        let currentEmbedItems = [];
        let embedItemArray = [];
        let pages = [];

        let buttonList = [button1, button2];

        if(warning.Content.length > 5) {
            warning.Content.forEach((w, i) => {
                if (currentEmbedItems.length < 5) currentEmbedItems.push(w);
                else {
                    embedItemArray.push(currentEmbedItems);
                    currentEmbedItems = [w];
                }

            });
            embedItemArray.push(currentEmbedItems);

            embedItemArray.forEach((x) => {
                let warns = x
                .map((w) => `**ID**: \`${w.WarningID}\`
                **Причина:** ${w.Reason}
                **Истекает**: ${w.Duration ? `<t:${parseInt(w.Duration / 1000)}:R>` : "**Никогда**"}
                **Дата выдачи**: ${w.Date}
                **Выдал:** <@${w.ExecuterID}>`)
                .join("\n\n");

                let Embed = new MessageEmbed()
                .setTitle(`${Target.user.username}'s warnings`)
                .setColor("#2f3136")
                .setThumbnail(Target.user.avatarURL())
                .setDescription(`${warns}`)
                .setTimestamp();

                pages.push(Embed);
            });

            await paginationEmbed(interaction, pages, buttonList);
        } else {
            let warns = warning.Content
            .map((w) => `**ID**: \`${w.WarningID}\`
            **Причина:** ${w.Reason}
            **Истекает**: ${w.Duration ? `<t:${parseInt(w.Duration / 1000)}:R>` : "**Никогда**"}
            **Дата выдачи**: ${w.Date}
            **Выдал:** <@${w.ExecuterID}>`)
            .join("\n\n");

            let Embed = new MessageEmbed()
            .setTitle(`${Target.user.username}'s warnings`)
            .setColor("#2f3136")
            .setThumbnail(Target.user.avatarURL())
            .setDescription(`${warns}`)
            .setFooter({ text: "Page 1 / 1" })
            .setTimestamp();

            return interaction.reply({embeds: [Embed]});
        }
    }
}