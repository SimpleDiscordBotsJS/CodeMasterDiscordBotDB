const { ButtonInteraction, EmbedBuilder, Client } = require("discord.js");

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
            embeds: [new EmbedBuilder().setDescription("Это кнопка устарела!").setColor("#e15050")], ephemeral: true
        });

        if(button == undefined) return;

        if(button.permission && !interaction.member.permissions.has(button.permission)) return interaction.reply({
            embeds: [new EmbedBuilder().setDescription("У вас нет прав, для использования этой кнопки!")
            .setColor("#e15050")], ephemeral: true 
        });

        if(button.ownerOnly && interaction.member.id !== interaction.guild.ownerId) return interaction.reply({
            embeds: [new EmbedBuilder().setDescription("Эта кнопка, только для владельцев сервера!")
            .setColor("#e15050")], ephemeral: true
        });

        if(button.developer && interaction.user.id !== client.config.DEV_ID) return interaction.reply({
            embeds: [new EmbedBuilder().setDescription("Эта кнопка, только для разработчиков!")
            .setColor("#e15050")], ephemeral: true
        });

        button.execute(interaction, client);
    },
};