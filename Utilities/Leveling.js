const { Client } = require("discord.js");
const dataBase = require("../Structures/Schemas/Leveling/LevelingDB");
const { getLevelExp } = require("./LevelFunctions");
const { Error } = require("./Logger");

module.exports = {
    createUser, deleteUser, appendXp, appendLevel, 
    setXp, setLevel, fetch, subtractXp, subtractLevel,
    fetchLeaderboard, computeLeaderboard, xpFor, deleteGuild
};

// ============================================================ //
/**
 * @param {string} [userId] - Discord user id.
 * @param {string} [guildId] - Discord guild id.
 */
async function createUser(userId, guildId) {
    if(!userId) throw new TypeError("Не указан id пользователя.");
    if(!guildId) throw new TypeError("Не указан id гильдии.");

    const isUser = await dataBase.findOne({ userID: userId, guildID: guildId });
    if(isUser) return false;

    const newUser = new levels({ userID: userId, guildID: guildId });
    await newUser.save().catch(e => Error(`Ошибка при создании пользователя: ${e}`));

    return newUser;
}

// ============================================================ //
/**
 * @param {string} [userId] - Discord user id.
 * @param {string} [guildId] - Discord guild id.
 */
async function deleteUser(userId, guildId) {
    if(!userId) throw new TypeError("Не указан id пользователя.");
    if(!guildId) throw new TypeError("Не указан id гильдии.");

    const user = await dataBase.findOne({ userID: userId, guildID: guildId });
    if(!user) return false;

    await dataBase.findOneAndDelete({ userID: userId, guildID: guildId }).catch(e => Error(`Ошибка при удалении пользователя: ${e}`));

    return user;
}

// ============================================================ //
/**
 * @param {string} [userId] - Discord user id.
 * @param {string} [guildId] - Discord guild id.
 * @param {number} [xp] - Amount of xp to append.
 */
async function appendXp(userId, guildId, xp) {
    if(!userId) throw new TypeError("Не указан id пользователя.");
    if(!guildId) throw new TypeError("Не указан id гильдии.");
    if(xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("Количество XP не было указано/было недействительным.");

    const user = await dataBase.findOne({ userID: userId, guildID: guildId });

    if(!user) {
        const newUser = new levels({
            userID: userId,
            guildID: guildId,
            xp: xp,
            level: Math.floor(0.1 * Math.sqrt(xp))
        });

        await newUser.save().catch(e => Error(`Не удалось сохранить нового пользователя.`));

        return (Math.floor(0.1 * Math.sqrt(xp)) > 0);
    };

    user.xp += parseInt(xp, 10);
    user.level = Math.floor(0.1 * Math.sqrt(user.xp));
    user.lastUpdated = new Date();
 
    await user.save().catch(e => Error(`Не удалось добавить xp: ${e}`) );

    return (Math.floor(0.1 * Math.sqrt(user.xp -= xp)) < user.level);
}

// ============================================================ //
/**
 * @param {string} [userId] - Discord user id.
 * @param {string} [guildId] - Discord guild id.
 * @param {number} [levels] - Amount of levels to append.
 */
async function appendLevel(userId, guildId, levels) {
    if(!userId) throw new TypeError("Не указан id пользователя.");
    if(!guildId) throw new TypeError("Не указан id гильдии.");
    if(!levels) throw new TypeError("Количество уровней не указано.");

    const user = await dataBase.findOne({ userID: userId, guildID: guildId });
    if(!user) return false;
    
    user.level += parseInt(levels, 10);
    user.xp = await getLevelExp(user.level);
    user.lastUpdated = new Date();
 
    user.save().catch(e => Error(`Не удалось добавить уровень: ${e}`) );

    return user;
}

// ============================================================ //
/**
 * @param {string} [userId] - Discord user id.
 * @param {string} [guildId] - Discord guild id.
 * @param {number} [xp] - Amount of xp to set.
 */
async function setXp(userId, guildId, xp) {
    if(!userId) throw new TypeError("Не указан id пользователя.");
    if(!guildId) throw new TypeError("Не указан id гильдии.");
    if(xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("Количество XP не было указано/было недействительным.");

    const user = await dataBase.findOne({ userID: userId, guildID: guildId });
    if(!user) return false;

    user.xp = xp;
    user.level = Math.floor(0.1 * Math.sqrt(user.xp));
    user.lastUpdated = new Date();
  
    user.save().catch(e => Error(`Не удалось установить XP: ${e}`) );

    return user;
}

// ============================================================ //
/**
 * @param {string} [userId] - Discord user id.
 * @param {string} [guildId] - Discord guild id.
 * @param {number} [level] - A level to set.
 */
async function setLevel(userId, guildId, level) {
    if(!userId) throw new TypeError("Не указан id пользователя.");
    if(!guildId) throw new TypeError("Не указан id гильдии.");
    if(!level) throw new TypeError("Уровень не был предоставлен.");

    const user = await dataBase.findOne({ userID: userId, guildID: guildId });
    if(!user) return false;

    user.level = level;
    user.xp = await getLevelExp(user.level);
    user.lastUpdated = new Date();
    
    user.save().catch(e => Error(`Не удалось установить уровень: ${e}`) );

    return user;
}

// ============================================================ //
/**
 * @param {string} [userId] - Discord user id.
 * @param {string} [guildId] - Discord guild id.
 */
async function fetch(userId, guildId, fetchPosition = false) {
    if(!userId) throw new TypeError("Не указан id пользователя.");
    if(!guildId) throw new TypeError("Не указан id гильдии.");

    const user = await dataBase.findOne({ userID: userId, guildID: guildId });
    if(!user) return false;

    if(fetchPosition === true) {
        const leaderboard = await dataBase.find({ guildID: guildId }).sort([['xp', 'descending']]).exec();
        user.position = leaderboard.findIndex(i => i.userID === userId) + 1;
    }

    /* To be used with canvacord or displaying xp in a pretier fashion, with each level the cleanXp stats from 0 and goes until cleanNextLevelXp when user levels up and gets back to 0 then the cleanNextLevelXp is re-calculated */
    user.cleanXp = user.xp - await xpFor(user.level);
    user.cleanNextLevelXp = await xpFor(user.level + 1) - await xpFor(user.level);
    
    return user;
}

// ============================================================ //
/**
 * @param {string} [userId] - Discord user id.
 * @param {string} [guildId] - Discord guild id.
 * @param {number} [xp] - Amount of xp to subtract.
 */
async function subtractXp(userId, guildId, xp) {
    if(!userId) throw new TypeError("Не указан id пользователя.");
    if(!guildId) throw new TypeError("Не указан id гильдии.");
    if(xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("Количество XP не было указано/было недействительным.");

    const user = await dataBase.findOne({ userID: userId, guildID: guildId });
    if(!user) return false;

    user.xp -= xp;
    user.level = Math.floor(0.1 * Math.sqrt(user.xp));
    user.lastUpdated = new Date();
   
    user.save().catch(e => Error(`Не удалось вычесть XP: ${e}`) );

    return user;
}

// ============================================================ //
/**
 * @param {string} [userId] - Discord user id.
 * @param {string} [guildId] - Discord guild id.
 * @param {number} [levels] - Amount of levels to subtract.
 */
async function subtractLevel(userId, guildId, levels) {
    if(!userId) throw new TypeError("Не указан id пользователя.");
    if(!guildId) throw new TypeError("Не указан id гильдии.");
    if(!levels) throw new TypeError("Количество уровней не указано.");

    const user = await dataBase.findOne({ userID: userId, guildID: guildId });
    if(!user) return false;

    user.level -= levels;
    user.xp = await getLevelExp(user.level);
    user.lastUpdated = new Date();
    
    user.save().catch(e => Error(`Не удалось вычесть уровни: ${e}`) );

    return user;
}

// ============================================================ //
/**
 * @param {string} [guildId] - Discord guild id.
 * @param {number} [limit] - Amount of maximum enteries to return.
 */
async function fetchLeaderboard(guildId, limit) {
    if(!guildId) throw new TypeError("Не указан id гильдии.");
    if(!limit) throw new TypeError("Лимит не был установлен.");

    var users = await dataBase.find({ guildID: guildId }).sort([['xp', 'descending']]).exec();

    return users.slice(0, limit);
}

// ============================================================ //
/**
 * @param {Client} [client] - Your Discord.Client.
 * @param {array} [leaderboard] - The output from 'fetchLeaderboard' function.
 */
async function computeLeaderboard(client, leaderboard, fetchUsers = false) {
    if(!client) throw new TypeError("Клиент не был предоставлен.");
    if(!leaderboard) throw new TypeError("Не указан id таблицы лидеров.");

    if(leaderboard.length < 1) return [];

    const computedArray = [];

    if(fetchUsers) {
        for (const key of leaderboard) {
            const user = await client.users.fetch(key.userID) || { username: "Unknown", discriminator: "0000" };
            computedArray.push({
                guildID: key.guildID,
                userID: key.userID,
                xp: key.xp,
                level: key.level,
                position: (leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
                username: user.username,
                discriminator: user.discriminator
            });
        }
    } else {
        leaderboard.map(key => computedArray.push({
            guildID: key.guildID,
            userID: key.userID,
            xp: key.xp,
            level: key.level,
            position: (leaderboard.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
            username: client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).username : "Unknown",
            discriminator: client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).discriminator : "0000"
        }));
    }
  
    return computedArray;
}

// ============================================================ //
/**
 * @param {number} [targetLevel] - Xp required to reach that level.
 */
async function xpFor (targetLevel) {
    if(isNaN(targetLevel) || isNaN(parseInt(targetLevel, 10))) throw new TypeError("Уровень цели должен быть действительным числом.");
    if(isNaN(targetLevel)) targetLevel = parseInt(targetLevel, 10);
    if(targetLevel < 0) throw new RangeError("Уровень цели должен быть положительным числом.");
    const level = await getLevelExp(targetLevel);
    return level;
}

// ============================================================ //
/**
 * @param {string} [guildId] - Discord guild id.
 */
async function deleteGuild(guildId) {
    if(!guildId) throw new TypeError("Не указан id гильдии.");

    const guild = await dataBase.findOne({ guildID: guildId });
    if(!guild) return false;

    await dataBase.deleteMany({ guildID: guildId }).catch(e => Error(`Не удалось удалить гильдию: ${e}`));

    return guild;
}