const { Client, Collection } = require("discord.js");
const client = new Client({ intents: 32767 });
const Logger = require("../Utilites/Logger");
const { BOT_TOKEN } = require("./config.json");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const { AsciiTable3 } = require("ascii-table3");

//===========================================================

client.commands = new Collection();
client.buttons = new Collection();
client.cooldowns = new Collection();
client.filters = new Collection();
client.filtersLog = new Collection();
client.scamlinksLog = new Collection();

["Events", "Commands", "Buttons"].forEach(handler => {
    require(`./Handlers/${handler}`)(client, PG, AsciiTable3);
});

//===========================================================

client.on("error", (error) => { Logger.Error(error) });
client.on("warn", (error) => { Logger.Warning(error) });
//client.on("debug", (message) => { Logger.Debug(message) }); // Debug

//===========================================================

// Анти-краш и прочее...
process.on("unhandledRejection", (reason, p) => {
    Logger.Warning('=== unhandled Rejection ==='.toUpperCase(),
    'Reason: ' + reason.stack ? String(reason.stack) : String(reason),
    '==========================='.toUpperCase());
});
process.on("uncaughtException", (err, origin) => {
    Logger.Error('=== uncaught Exception ==='.toUpperCase(),
    'Exception: ' + err.stack ? err.stack : err,
    '==========================='.toUpperCase());
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
    Logger.Error('=== uncaught Exception Monitor ==='.toUpperCase());
});
process.on('beforeExit', (code) => {
    Logger.Warning('======= before Exit ======='.toUpperCase(),
    'Code: ' + code,
    '==========================='.toUpperCase());
});
process.on('exit', (code) => {
    Logger.Warning('========== exit =========='.toUpperCase(), 
    'Code: ' + code,
    '=========================='.toUpperCase());
});
process.on('multipleResolves', (type, promise, reason) => {
    Logger.Warning('==== multiple Resolves ===='.toUpperCase(),
    type, promise, reason,
    '==========================='.toUpperCase());
});

//===========================================================

//Подключение к боту и вывод ошибки в случае отсутствия токена, или если токен неверен.
client.login(BOT_TOKEN).catch(() => Logger.Error("[BOT] Неверный токен для входа от имени бота."));

//===========================================================

//Завершение работы
process.on("SIGINT", () => { Logger.Success("SIGINT detected, exiting..."); process.exit(0); });