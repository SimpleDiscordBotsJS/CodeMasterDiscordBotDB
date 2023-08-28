const { StringSelectMenuInteraction } = require("discord.js");
const { Error } = require("../../../Structures/Utilities/Logger");

//Не имеющий никакого значения селект. Нужен лишь для заполнения и примера

module.exports = {
    id: "test",
    /**
     * @param {StringSelectMenuInteraction} interaction 
     */
    async execute(interaction) {
        try {
            interaction.reply({ content: "Тест", ephemeral: true });
        } catch (err) {
            Error(err);
        }
    }
}