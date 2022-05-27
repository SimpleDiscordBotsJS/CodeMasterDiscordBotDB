const { ButtonInteraction } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ButtonInteraction} interaction
     */
    execute(interaction, client) {
        if(!interaction.isButton()) return;
        const Button = client.buttons.get(interaction.customId);
        if(!Button) return; 

        if(Button.permission && !interaction.member.permissions.has(Button.permission))
        return interaction.reply({content: "У вас нет прав, для использования этой кнопки!", ephemeral: true});

        if(Button.ownerOnly && interaction.member.id !== interaction.guild.ownerId)
        return interaction.reply({content: "Эта кнопка, только для владельцев сервера!", ephemeral: true});
    
        Button.execute(interaction, client);
    }
}