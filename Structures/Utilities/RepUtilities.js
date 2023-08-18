const dataBase = require("../Data/Schemas/ReputationDB");
//===========================================================//

/**
 * @param {String} GuildID
 * @param {String} UserID
 * @param {Number} Amount
 */
async function repAdd(GuildID, UserID, Amount) {
    try {
        const data = await getData(GuildID, UserID);

        data.Reputation.Positive += Amount;
        await data.save();

        return data;
    } catch (error) {
        throw error;
    }
}


/**
 * @param {String} GuildID
 * @param {String} UserID
 * @param {Number} Amount
 */
async function repRemove(GuildID, UserID, Amount) {
    try {
        const data = await getData(GuildID, UserID);

        data.Reputation.Negative -= Amount;
        await data.save();

        return data;
    } catch(error) {
        throw error;
    }
}


/**
 * @param {String} GuildID
 * @param {String} UserID
 */
async function getData(GuildID, UserID) {
    try {
        let data = await dataBase.findOne({ GuildID: GuildID, UserID: UserID });
        if(!data) data = await createUserInDB(GuildID, UserID);

        return data;
    } catch(error) {
        throw error;
    }
}


/**
 * @param {String} GuildID
 * @param {String} UserID
 */
async function createUserInDB(GuildID, UserID) {
    try {
        const data = await dataBase.create({
            GuildID: GuildID, UserID: UserID, 
            Reputation: { Positive: 0,  Negative: 0 }
        });

        return data;
    } catch(error) {
        throw error;
    }
}

//===========================================================//
module.exports = { repAdd, repRemove, getData }