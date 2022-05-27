const { ButtonInteraction } = require("discord.js");
const DB = require("../../Structures/Schemas/PollDB");

module.exports = {
    id: "poll-1",
    /**
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        const data = await DB.findOne({ GuildID: interaction.guild.id, MessageID: interaction.message.id })
        if(!data) return;

        if(data.Users.includes(interaction.user.id))
        return interaction.reply({content: `Вы уже выбрали свой ответ`, ephemeral: true});

        await DB.findOneAndUpdate({ GuildID: interaction.guild.id, MessageID: interaction.message.id}, {Button1: data.Button1 + 1, $push: { Users: interaction.user.id }});

        interaction.reply({content: `Ваш ответ отправлен`, ephemeral: true});
    }
}