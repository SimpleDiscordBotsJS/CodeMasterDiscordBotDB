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
client.config= require("./Data/Configs/config.json");

client.events = new Collection();
client.buttons = new Collection();
client.commands = new Collection();

//========================= Каналы ==========================
client.antiScamLog = new Collection();

//===========================================================
const { connect } = require("mongoose");
if(!process.env.DATABASE_URL) {
    Warning("[DataBase] Нет ссылки для подключения к базе данных!");
} else {
    connect(client.config.DATABASE_URL, {}).then(() => {
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

//===========================================================
// Anti-Crash and more...
process.on("unhandledRejection", (reason, p) => { Warning(
    '=== [ Unhandled Rejection/Catch ] ==='.toUpperCase(),
    'Reason: ' + reason.stack ? String(reason.stack) : String(reason),
    '====================================='.toUpperCase());
});

process.on("uncaughtException", (err, origin) => { Error(
    '=== [ Uncaught Exception ] ==='.toUpperCase(),
    'Exception: ' + err.stack ? err.stack : err,
    '=============================='.toUpperCase());
});

process.on('uncaughtExceptionMonitor', (err, origin) => { Error(
    '=== [ Uncaught Exception Monitor ] ==='.toUpperCase(),
    err, origin,
    '======================================'.toUpperCase());
});

process.on('beforeExit', (code) => { Warning(
    '======= [ Before Exit ] ======='.toUpperCase(),
    'Code: ' + code,
    '==============================='.toUpperCase());
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
/*
process.on('multipleResolves', (type, promise, reason) => { Warning(
    '==== [ Multiple Resolves ] ===='.toUpperCase(),
    type, promise, reason,
    '==============================='.toUpperCase());
});
*/
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