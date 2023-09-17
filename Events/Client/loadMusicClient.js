const { Client } = require("discord.js");
const { Success } = require("../../Structures/Utilities/Logger");
const { loadPlayerEvents } = require("../../Structures/Handlers/playerHandler");
const { Player } = require("discord-player");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        const player = new Player(client);
        await player.extractors.loadDefault();

        await loadPlayerEvents(player);
        
        Success(`[MUSIC] Музыкальный клиент запущен`);
    }
}