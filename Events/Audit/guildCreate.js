const { GuildManager } = require("discord.js");
const { Info } = require("../../Utilities/Logger");

module.exports = {
    name: "guildCreate",
    /**
     * @param {GuildManager} guild 
     */
    async execute(guild) {
        return Info(`Я был добавлен на сервер: ${guild.name} (${guild.id})!`);
    }
}