const { Client } = require("discord.js");
const { Success, Error } = require("../../Structures/Utilities/Logger");
const { loadPlayerEvents } = require("../../Structures/Handlers/playerHandler");
const { Player } = require("discord-player");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        try {
            const player = new Player(client);
            await player.extractors.loadDefault();

            await loadPlayerEvents(player);
            
            Success(`[MUSIC] Музыкальный клиент запущен`);
        } catch (error) {
            return Error(`[Client/loadMusicClient] Произошла ошибка:\n${error}`);
        }
    }
}