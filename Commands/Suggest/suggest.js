const { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, ButtonStyle } = require("discord.js");
const { Error } = require("../../Structures/Utilities/Logger");
const SetupDB = require("../../Structures/Data/Schemas/Suggest/SuggestSetupDB");
const DB = require("../../Structures/Data/Schemas/Suggest/SuggestDB");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("suggest")
    .setNameLocalizations({ "ru": "предложить" })
    .setDescription("Make a suggestion.")
    .setDescriptionLocalizations({ "ru": "Сделать предложение." })
    .addStringOption((string) => string
        .setName("type")
        .setNameLocalizations({ "ru": "тип" })
        .setDescription("Select a type.")
        .setDescriptionLocalizations({ "ru": "Выберите тип предложения." })
        .addChoices(
            { name: "💻Сервер", value: "server" },
            { name: "🤖Дискорд бот", value: "discordBot" },
            { name: "🔘Другое", value: "other" }
        )
        .setRequired(true)
    )
    .addStringOption((string) => string
        .setName("suggestion")
        .setNameLocalizations({ "ru": "предложение" })
        .setDescription("Describe your suggestion.")
        .setDescriptionLocalizations({ "ru": "Опишите ваше предложение." })
        .setMaxLength(512)
        .setRequired(true)
    ),
    cooldown: 360000,
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guild, member, user } = interaction;

        const Type = options.getString("type");
        const Suggestion = options.getString("suggestion");

        function switchTo(value) {
            let status = " ";
            switch(value) {
                case "server" : status = `\`Сервер\``
                break;
                case "discordBot" : status = `\`Дискорд бот\``
                break;
                case "other" : status = `\`Другое\``
                break;
            }
            return status;
        }

        const Embed = new EmbedBuilder().setColor("#fc6600")
        .setAuthor({name: user.tag, iconURL: user.displayAvatarURL({ size:  512 })})
        .addFields(
            { name: "**[`💡`] Предложение:**", value: Suggestion, inline: false },
            { name: "**[`📌`] Тип:**", value: switchTo(Type), inline: true },
            { name: "**[`🟠`] Статус:**", value: "`Ожидает`", inline: true }
        ).setFooter({ text: `Author ID: ${user.id}` }).setTimestamp();
        
        const Buttons = new ActionRowBuilder();
        Buttons.addComponents(
            new ButtonBuilder().setCustomId("suggest-accept")
            .setLabel("✅ Принять").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("suggest-decline")
            .setLabel("⛔ Отклонить").setStyle(ButtonStyle.Danger)
        );

        const SuggestSetupDB = await SetupDB.findOne({ GuildID: guild.id });

        if(!SuggestSetupDB) return interaction.reply({ embeds: [new EmbedBuilder().setColor("Red")
            .setDescription("Этот сервер не настроил систему предложений.")
        ], ephemeral: true });

        try {
            const M = await guild.channels.cache.get(SuggestSetupDB.ChannelID).send({ embeds: [Embed], components: [Buttons], fetchReply: true });
            await M.react('✅');
            await M.react('⛔');

            await M.startThread({ name: `${capitalizeFirstLetter(Suggestion).substring(0, 50)}...`, autoArchiveDuration: 1440 }).then((thread) => {
                thread.setLocked(true);
            });

            function capitalizeFirstLetter(string) {
                return string[0].toUpperCase() + string.slice(1);
            }
        
            await DB.create({GuildID: guild.id, MessageID: M.id, Details: [
                { MemberID: member.id, Type: Type, Suggestion: Suggestion }
            ]});
            interaction.reply({ embeds: [new EmbedBuilder().setColor("Gold")
                .setDescription(`✅ Ваше [предложение](${M.url}) было добавлено в ${guild.channels.cache.get(SuggestSetupDB.ChannelID)}`)], ephemeral: true });
        } catch (err) {
            Error(err);
        }
    }
}
