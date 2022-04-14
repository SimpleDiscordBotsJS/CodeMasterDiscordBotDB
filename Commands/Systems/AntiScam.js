const { CommandInteraction, Client } = require("discord.js");
const DB = require("../../Structures/Schemas/AntiScamDB");

module.exports = {
    name: "antiscam",
    description: "Setup Anti-Scam",
    permission: "MANAGE_MESSAGES",
    options: [{ name: "setup", description: "Anti-Scam Settings", type: "SUB_COMMAND", options: [{
                name: "logging", description: "Выберите канал логгирования.",
                type: "CHANNEL", channelTypes: ["GUILD_TEXT"], required: true
            }]
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { guild, options } = interaction;
        const SubCommand = options.getSubcommand();

        switch (SubCommand) {
            case "setup": {
                const loggingChannel = options.getChannel("logging").id;

                await DB.findOneAndUpdate(
                    { GuildID: guild.id }, 
                    { ChannelID: loggingChannel },
                    { new: true, upsert: true }
                );

                client.scamlinksLog.set(guild.id, loggingChannel);

                interaction.reply({ content: `Канал логгирования AntiScam системы, установлен на <#${loggingChannel}>`, ephemeral: true });
            }
            break;
        }
    }
}
