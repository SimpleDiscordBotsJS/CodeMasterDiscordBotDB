const DB = require("../../Structures/Schemas/Suggest/SuggestDB");

module.exports = {
    id: "suggest-accept",
    permission: "ADMINISTRATOR",
    async execute(interaction) {
        const { guildId, message } = interaction;

        DB.findOne({GuildID: guildId, MessageID: message.id}, async(err, data) => {
            if(err) throw err;
            if(!data) return interaction.reply({content: "Информация, в базе данных, не найдена!", ephemeral: true});
        
            const Embed = message.embeds[0];
            if(!Embed) return;

            Embed.fields[2] = {name: "Статус:", value: "Принято", inline: true};
            message.edit({embeds: [Embed.setColor("GREEN")], components: []});
            interaction.reply({content: "Предложение принято", ephemeral: true});
        });
    }
}