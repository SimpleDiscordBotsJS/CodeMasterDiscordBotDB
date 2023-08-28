
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
async function getRandomInt(min, max) {
    if(typeof min !== "number" || typeof max !== "number") throw new TypeError("Expected type: Number");
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Функция отдаст массив из строки
/**
 * String converter: camelCaseString => ['camel', 'Case', 'String']
 * @param {string} string Any camelCase string
 * @param {string | null} joinCharacter If provided, joins the array output back together using the character
 * @returns {Array<string> | string} array of strings if joinCharacter is omitted, string if provided
 */
async function splitCamelCaseStr(string, joinCharacter = ' ') {
  const array = string.split(/ |\B(?=[A-Z])/);

  if(typeof joinCharacter === "string") {
    return array.join(joinCharacter);
  }
  return array;
};

//Функция отдаёт строку, начинающуюся с верхнего регистра
/**
 * Get a string starting from upper case
 * @param {string} string String
 * @returns {string} Returns a string
 */
async function capitalizeFirstLetter(string) {
    if(typeof string !== "string") throw new TypeError("Expected type: String");
    return `${ string.charAt(0).toUpperCase() }${ string.slice(1) }`;
}

//
/**
 * Replace HTML tags to Discord text formatter
 * @param {string} html 
 * @param {boolean} removeLineBreaks Default: true
 * @returns {string}
 */
async function cleanAnilistHTML(html, removeLineBreaks = true) {
    let clean = html;
    if(removeLineBreaks) clean = clean.replace(/\r|\n|\f/g, "");
    clean = entities.decode(clean);
    clean = clean
        .replaceAll("<br>", "\n")
        .replace(/<\/?i>/g, "*")
        .replace(/<\/?b>/g, "**")
        .replace(/~!|!~/g, "||");
    if (clean.length > 2000) clean = `${clean.substring(0, 1995)}...`;
    const spoilers = (clean.match(/\|\|/g) || []).length;
    if (spoilers !== 0 && (spoilers && (spoilers % 2))) clean += "||";
    return clean;
}

//
/**
 * Encode and decode texts in base64
 * @param {string} string 
 * @param {string} mode 
 * @returns {string}
 */
async function base64(string, mode = "encode") {
    if(mode === "encode") return Buffer.from(string).toString("base64");
    if(mode === "decode") return Buffer.from(string, "base64").toString("utf8") || null;
    throw new TypeError(`${mode} base64 mode is not supported`);
}

//
/**
 * String converter: Mary Had A Little Lamb
 * @param {string} string Any string of characters
 * @returns {string} The string in title-case format
 */
async function titleCase(string) {
    if (typeof string !== "string") throw new TypeError("Expected type: String");
    string = string.toLowerCase().split(" ");
    for (let i = 0; i < string.length; i++) string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
    return string.join(" ");
};