const { ButtonInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const DB = require("../../../Structures/Data/Schemas/Suggest/SuggestDB");

module.exports = {
    id: "suggest-decline",
    permission: PermissionFlagsBits.Administrator,
    /**
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        const { guildId, message } = interaction;

        try {
            const data = await DB.findOne({ GuildID: guildId, MessageID: message.id });
            if(!data) return interaction.reply({content: "Информация, в базе данных, не найдена!", ephemeral: true});
        
            const Embed = message.embeds[0];
            if(!Embed) return;

            Embed.fields[2] = {name: "Статус:", value: "Отклонено", inline: true};
            message.edit({embeds: [EmbedBuilder.from(Embed).setColor("Red")], components: []});
            if(message.thread) if(!message.thread.archived) message.thread.setArchived(true);
            interaction.reply({content: "Предложение отклонено", ephemeral: true})

        } catch (error) {
            throw error;
        }
    }
}