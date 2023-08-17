const { Client, ModalSubmitInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {Client} client
     * @param {ModalSubmitInteraction} interaction
     */
    async execute(interaction, client) {
        if (!interaction.isModalSubmit()) return;

        const modal = client.modals.get(interaction.customId);
        if(!modal) return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor("Red").setDescription("Это модальное окно устарело!"),
            ], ephemeral: true
        });

        if(modal.developer && interaction.user.id !== client.config.DEV_ID) return interaction.reply({
            embeds: [new EmbedBuilder().setDescription("Эта команда, только для разработчиков!")
            .setColor("#e15050")], ephemeral: true
        });

        modal.execute(interaction, client);
    }
}