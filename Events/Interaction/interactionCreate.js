const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const CooldownsDB = require("../../Structures/Schemas/CooldownsDB");

module.exports = {
    name: "interactionCreate",
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if(interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);
            if(!command) return interaction.reply({embeds: [new MessageEmbed().setColor("RED")
                .setDescription("⛔ Произошла ошибка при выполнении этой команды.")
            ], ephemeral: true}) && client.commands.delete(interaction.commandName);

            // PERMISSION CHECK //

            if(command.permission && !interaction.member.permissions.has(command.permission)) {
                return interaction.reply({embeds: [new MessageEmbed().setColor("RED")
                    .setDescription(`У вас нет прав для использования этой команды: \`${interaction.commandName}\``)], 
                ephemeral: true });
            }

            // CHECK FOR COOLDOWNS COMMAND //

            const { user, guild, guildId } = interaction;

            if(command) {
                const CommandName = command.name.replace(" ", "").toLowerCase();

                if(command.cooldown) {
                    const cooldown = client.cooldowns.get(`${guildId}||${CommandName}||${user.id}`) - Date.now();
                    const time = Math.floor(cooldown / 1000) + "";

                    const Data = await CooldownsDB.findOne({ Details: `${guildId}||${CommandName}||${user.id}` });

                    if(!Data && user.id != guild.ownerId) {
                        await CooldownsDB.create({
                            Details: `${guildId}||${CommandName}||${user.id}`,
                            Time: Date.now() + command.cooldown,
                        });
                    }

                    if(client.cooldowns.has(`${guildId}||${CommandName}||${user.id}`))
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED")
                        .setDescription(`⛔ __Перезарядка__ команды **${command.name}** всё ещё активна.
                            Вы должны подождать еще \` ${time.split(".")[0]} \` *секунд(у)*.`
                        )], ephemeral: true
                    });

                    if(user.id != guild.ownerId) {
                        client.cooldowns.set(`${guildId}||${CommandName}||${user.id}`, Date.now() + command.cooldown);
                    }

                    setTimeout(async () => {
                        client.cooldowns.delete(`${guildId}||${CommandName}||${user.id}`);
                        await CooldownsDB.findOneAndDelete({Details: `${guildId}||${CommandName}||${user.id}`});
                    }, command.cooldown);
                }
            }
            
            command.execute(interaction, client);
        }
    }
}