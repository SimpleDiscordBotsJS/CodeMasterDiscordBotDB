const { ButtonInteraction, Client } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if(!interaction.isButton()) return;

        const button = client.buttons.get(interaction.customId);
        if(!button) return interaction.reply({ 
            content: "Эта кнопка устарела.", ephemeral: true
        });

        if(button == undefined) return;

        if(button.permission && !interaction.member.permissions.has(button.permission)) return interaction.reply({ 
            content: "У вас нет прав, для использования этой кнопки!", ephemeral: true 
        });

        if(button.ownerOnly && interaction.member.id !== interaction.guild.ownerId) return interaction.reply({
            content: "Эта кнопка, только для владельцев сервера!", ephemeral: true
        });

        if(button.developer && interaction.user.id !== client.config.DEV_ID) return interaction.reply({ 
            content: "Эта кнопка, только для разработчиков!", ephemeral: true
        });

        button.execute(interaction, client);
    },
};