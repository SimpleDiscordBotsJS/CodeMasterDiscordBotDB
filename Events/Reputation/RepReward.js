const { Message, Client } = require("discord.js");
const { getData } = require("../../Structures/Utilities/RepUtilities");
const { Error } = require("../../Structures/Utilities/Logger");

//TODO: Переделать систему наград.

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        const { member, guild, author } = message;
        if(author.bot) return;

        const { REP_ROLE_1, REP_ROLE_2, REP_ROLE_3 } = client.config;

        const data = await getData(guild.id, member.id);
        if(!data) return;

        const rep = data.Reputation.Positive + data.Reputation.Negative;
        const rolesToAdd = [];

        if(rep >= 100 && rep <= 149 && REP_ROLE_1) {
            rolesToAdd.push(REP_ROLE_1);
        }

        if(rep >= 150 && rep <= 599 && REP_ROLE_2) {
            rolesToAdd.push(REP_ROLE_2);
            if(REP_ROLE_1) rolesToAdd.push(REP_ROLE_1);
        }

        if(rep >= 600 && REP_ROLE_3) {
            rolesToAdd.push(REP_ROLE_3);
            if(REP_ROLE_2) rolesToAdd.push(REP_ROLE_2);
            if(REP_ROLE_1) rolesToAdd.push(REP_ROLE_1);
        }

        const memberRoles = member.roles.cache.map(role => role.id);
        rolesToAdd.forEach(async roleToAdd => {
            if(!(await member.guild.roles.fetch(roleToAdd))) return;
            if(!memberRoles.includes(roleToAdd)) {
                member.roles.add(roleToAdd).catch(e => {
                    Error(`[Reputation/RepReward] Произошла ошибка при выдаче ролей:\n${e}`);
                });
            }
        });

        const rolesToRemove = [REP_ROLE_3, REP_ROLE_2, REP_ROLE_1].filter(role => role && !rolesToAdd.includes(role));
        rolesToRemove.forEach(async roleToRemove => {
            if(!(await member.guild.roles.fetch(roleToRemove))) return;
            if(memberRoles.includes(roleToRemove)) {
                member.roles.remove(roleToRemove).catch(e => {
                    Error(`[Reputation/RepReward] Произошла ошибка при забирании ролей:\n${e}`);
                });
            }
        });
    }
}