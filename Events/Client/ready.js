const { Client } = require("discord.js");
const { Success } = require("../../Structures/Utilities/Logger");
const { loadCommands } = require("../../Structures/Handlers/commandHandler");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    execute(client) {
        Success(`✅ Запущен от имени бота: ${client.user.tag}!`);
        client.user.setActivity("CodeМ", {type: "STREAMING"});

        loadCommands(client);

        require("../../Systems/CooldownsSys")(client);
        require("../../Systems/AntiScamSys")(client);
        require("../../Systems/WarningSys")(client);
    }
}