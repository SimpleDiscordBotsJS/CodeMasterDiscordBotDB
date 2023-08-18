const { ChatInputCommandInteraction, EmbedBuilder, Client } = require("discord.js");
const cooldownUtil = require("../../Structures/Utilities/CooldownUtil");
const { iterate } = require("glob");

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

        const cooldownTime = command.cooldown || 0
        const userId = interaction.user.id

        if(cooldownUtil.inCooldown(userId, interaction.commandName)) {
            const remainingTime = cooldownUtil.getCooldown(userId, interaction.commandName)

            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setDescription(`Подождите ${remainingTime / 1000} сек. прежде чем использовать эту команду снова.`).setColor("#e15050")
                ],
                ephemeral: true
            })
        }

        if(command.developer && interaction.user.id !== client.config.DEV_ID) return interaction.reply({
            embeds: [new EmbedBuilder().setDescription("Эта команда, только для разработчиков!")
            .setColor("#e15050")], ephemeral: true
        });

        command.execute(interaction, client);

        if(cooldownTime > 0) {
            cooldownUtil.setCooldown(userId, interaction.commandName, command.cooldown)
        }
    }
}