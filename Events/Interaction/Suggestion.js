const { ButtonInteraction } = require("discord.js");
const DB = require("../../Structures/Schemas/Suggest/SuggestDB");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        if(!interaction.isButton()) return;

        if(!interaction.member.permissions.has("ADMINISTRATOR"))
        return interaction.reply({content: "Вы не можете использовать эту кнопку!", ephemeral: true});

        const { guildId, customId, message } = interaction;

        DB.findOne({GuildID: guildId, MessageID: message.id}, async(err, data) => {
            if(err) throw err;
            if(!data) return interaction.reply({content: "Информация, в базе данных, не найдена!", ephemeral: true});
        
            const Embed = message.embeds[0];
            if(!Embed) return;

            switch(customId) {
                case "suggest-accept" : {
                    Embed.fields[2] = {name: "Статус:", value: "Принято", inline: true};
                    message.edit({embeds: [Embed.setColor("GREEN")], components: []});
                    interaction.reply({content: "Предложение принято", ephemeral: true})
                }
                break;
                case "suggest-decline" : {
                    Embed.fields[2] = {name: "Статус:", value: "Отклонено", inline: true};
                    message.edit({embeds: [Embed.setColor("RED")], components: []});
                    interaction.reply({content: "Предложение отклонено", ephemeral: true})
                }
                break;
            }
        });
    }
}