const mongoose = require("mongoose");
const { Client } = require("discord.js");
const { Success, Error, Warning } = require("../../Utilities/Logger");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    execute(client) {
        Success(`✅ Запущен от имени бота: ${client.user.tag}!`);
        client.user.setActivity("Code Master", {type: "STREAMING"});
    
        if(!process.env.DATABASE_URL) return Warning("Отсутствует ссылка для подключения к базе данных!");
        mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            Success("Клиент успешно подключен к базе данных!");
        }).catch((err) => {
            Error(err);
        });

        require("../../Systems/CooldownsSys")(client);
        require("../../Systems/AntiScamSys")(client);
        require("../../Systems/WarningSys")(client);
    }
}