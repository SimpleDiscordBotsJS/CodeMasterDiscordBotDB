const { GuildManager } = require("discord.js");
const { Info } = require("../../Structures/Utilities/Logger");

module.exports = {
    name: "guildDelete",
    /**
     * @param {GuildManager} guild 
     */
    async execute(guild) {
        return Info(`Я удалён c сервера: ${guild.name} (${guild.id})!`);
    }
}