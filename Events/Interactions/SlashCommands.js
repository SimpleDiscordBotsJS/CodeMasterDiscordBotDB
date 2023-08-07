const { ChatInputCommandInteraction, EmbedBuilder, Client } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client 
     */
    execute(interaction, client) {
        if(!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if(!command) return interaction.reply({ 
            embeds: [new EmbedBuilder().setDescription("Это команда устарела!").setColor("#e15050")], ephemeral: true
        });

        if(command.developer && interaction.user.id !== client.config.DEV_ID) return interaction.reply({
            embeds: [new EmbedBuilder().setDescription("Эта команда, только для разработчиков!")
            .setColor("#e15050")], ephemeral: true
        });

        command.execute(interaction, client);
    }
}