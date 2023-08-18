const { Guild, User } = require("discord.js");
const dataBase = require("../Data/Schemas/ReputationDB");
//===========================================================//

/**
 * @param {Guild} Guild
 * @param {User} User
 * @param {Number} Amount
 */
async function repAdd(Guild, User, Amount) {
    let data = await dataBase.findOne({ GuildID: Guild.id, UserID: User.id });
    if(!data) {
        data = await createUserInDB(Guild.id, User.id);
    }

    data.Reputation.Positive += Amount;
    await data.save();

    return data;
}


/**
 * @param {Guild} Guild
 * @param {User} User
 * @param {Number} Amount
 */
async function repRemove(Guild, User, Amount) {
    let data = await dataBase.findOne({ GuildID: Guild.id, UserID: User.id });
    if(!data) {
        data = await createUserInDB(Guild.id, User.id);
    }

    data.Reputation.Negative -= Amount;
    await data.save();

    return data;
}


/**
 * @param {String} GuildID
 * @param {String} UserID
 */
async function createUserInDB(GuildID, UserID) {
    const data = await dataBase.create({ 
        GuildID: GuildID,
        UserID: UserID, 
        Reputation: { Positive: 0,  Negative: 0 }
    });

    return  data;
}

//===========================================================//
module.exports = { repAdd, repRemove }