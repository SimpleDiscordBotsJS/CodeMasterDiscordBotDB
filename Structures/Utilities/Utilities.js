
//Функция создание вебхука => отправка эмбеда => удаление вебхука.
//И я хрен знает, зачем она мне нужна. Но почему бы и не сохранить её?
async function createAndDeleteWebhook(channelID, embedName) {
    await channelID.createWebhook(member.guild.name, {
        avatar: member.guild.iconURL({ format: "png" })
    }).then(webhook => {
        webhook.send({
            embeds: [embedName]
        }).then(() => webhook.delete().catch(() => {}))
    });
}

//Функция получения случайного чиста в диапазоне
/**
 * Get a random number
 * @param {number} min Minimum number
 * @param {number} max Maximum number
 * @returns {number} Returns a number
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Функция отдаёт строку, начинающуюся с верхнего регистра
/**
 * Get a string starting from upper case
 * @param {string} string String
 * @returns {string} Returns a string
 */
function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}