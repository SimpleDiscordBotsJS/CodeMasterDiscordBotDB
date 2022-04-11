const { CommandInteraction } = require("discord.js");
const Logger = require("../../Utilites/Logger");

module.exports = {
    name: "ping",
    description: "ping command",
    permission: "ADMINISTRATOR",
    /**
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        interaction.reply({content: "POING", ephemeral: true});
        Logger.Info("PONG");
        Logger.Warning("PONG");
        Logger.Success("PONG");
        Logger.Message("PONG");
        Logger.Error("PONG");
        Logger.Debug("PONG");
    }
}