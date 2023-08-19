require("dotenv").config({ path: `./Structures/Data/Configs/.env` });
//===========================================================
const { Warning, Error, Success } = require("./Utilities/Logger");
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
//const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({ 
    intents: 131071,
    partials: [User, Message, GuildMember, ThreadMember] 
});

//===========================================================
client.config = require("./Data/Configs/config.json");

client.events = new Collection();
client.buttons = new Collection();
client.commands = new Collection();
client.modals = new Collection();

//========================= Каналы ==========================
client.antiScamLog = new Collection();

//===========================================================
const { connect } = require("mongoose");
if(!process.env.DATABASE_URL) {
    Warning("[DataBase] Нет ссылки для подключения к базе данных!");
} else {
    connect(process.env.DATABASE_URL, {}).then(() => {
        Success("[DataBase] Клиент подключен к базе данных.");
    }).catch((error) => {
        Warning("[DataBase] Клиенту не удалось подключиться к базе данных.");
        Error(error);
    });
}

const { loadEvents } = require("./Handlers/eventHandler");
loadEvents(client);

const { loadButtons } = require("./Handlers/buttonHandler");
loadButtons(client);

const { loadModals } = require("./Handlers/modalHandler");
loadModals(client);

//===========================================================
// Anti-Crash and more...
process.on("unhandledRejection", (reason, p) => { Warning(
    '=== [ Unhandled Rejection/Catch ] ==='.toUpperCase(),
    'Reason: ' + reason.stack ? String(reason.stack) : String(reason),
    '====================================='.toUpperCase());
});

process.on("uncaughtException", (err, origin) => { Error(
    '=== [ Uncaught Exception/Catch ] ==='.toUpperCase(),
    'Exception: ' + err.stack ? err.stack : err,
    '===================================='.toUpperCase());
});

process.on('uncaughtExceptionMonitor', (err, origin) => { Error(
    '=== [ Uncaught Exception Monitor ] ==='.toUpperCase(),
    err, origin,
    '======================================'.toUpperCase());
});

process.on('warning', (code) => { Warning(
    '========= [ Warning ] ========='.toUpperCase(),
    'Code: ' + code,
    '==============================='.toUpperCase());
});

process.on('exit', (code) => { Warning(
    '========== [ Exit ] =========='.toUpperCase(), 
    'Code: ' + code,
    '=============================='.toUpperCase());
});
//===========================================================
client.login(process.env.BOT_TOKEN).catch(() => {
    Error("[BOT] Неверный токен для входа от имени бота.");
    process.exit();
});

//===========================================================
process.on("SIGINT", () => { 
    Success("SIGINT detected, exiting..."); 
    process.exit(); 
});