const mongoose = require("mongoose");
const { Client } = require("discord.js");
const { DATABASE } = require("../../Structures/config.json");
const { Success, Error } = require("../../Utilites/Logger");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    execute(client) {
        Success(`✅ Запущен от имени бота: ${client.user.tag}!`);
        client.user.setActivity("Code Master", {type: "STREAMING"});
    
        if(!DATABASE) return;
        mongoose.connect(DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            Success("Клиент успешно подключен к базе данных!");
        }).catch((err) => {
            Error(err);
        });

        require("../../Systems/CooldownsSys")(client);
        require("../../Systems/ChatFilterSys")(client);
        require("../../Systems/AntiScamSys")(client);
    }
}