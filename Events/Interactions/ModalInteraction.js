const { Client, ModalSubmitInteraction, EmbedBuilder } = require("discord.js");
const cooldownUtil = require("../../Structures/Utilities/CooldownUtil");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {Client} client
     * @param {ModalSubmitInteraction} interaction
     */
    async execute(interaction, client) {
        if(!interaction.isModalSubmit()) return;

        const modal = client.modals.get(interaction.customId);
        if(!modal) return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor("Red").setDescription("Это модальное окно устарело!"),
            ], ephemeral: true
        });

        const cooldownTime = modal.cooldown || 0
        const userId = interaction.user.id

        if(cooldownUtil.inCooldown(userId, interaction.customId)) {
            const remainingTime = cooldownUtil.getCooldown(userId, interaction.customId)

            return interaction.reply({ embeds: [new EmbedBuilder().setColor("#e15050")
                    .setDescription(`Подождите ${remainingTime / 1000} сек. прежде чем отправить форму снова.`)
                ], ephemeral: true
            })
        }

        if(modal.developer && interaction.user.id !== client.config.DEV_ID) return interaction.reply({
            embeds: [new EmbedBuilder().setDescription("Эта команда, только для разработчиков!")
            .setColor("#e15050")], ephemeral: true
        });

        modal.execute(interaction, client);

        if(cooldownTime > 0) {
            cooldownUtil.setCooldown(userId, modal.customId, modal.cooldown)
        }
    }
}