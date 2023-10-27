/* Logger by LeonusDH (aka RADIO) */

/* Logger version 1.3.2 */

//===========================================================//
const fs = require("fs");
const logFilePath = `./Structures/Data/Logs`;
const logFileName = "Latest.log";

//===========================================================//
/**
 * @param  {...String} arguments 
 */
function Debug() {
    for(let i = 0; i < arguments.length; i++) {
        construct(`\x1b[1;35m[  DEBUG  ]: ` + arguments[i]);
        writeFile(`[  DEBUG  ]: ` + arguments[i]);
    }
}

//===========================================================//
/**
 * @param  {...String} arguments 
 */
function Error() {
    for(let i = 0; i < arguments.length; i++) {
        construct(`\x1b[1;31m[  ERROR  ]: ` + arguments[i]);
        writeFile(`[  ERROR  ]: ` + arguments[i]);
    }
}

//===========================================================//
/**
 * @param  {...String} arguments 
 */
function Info() {
    for(let i = 0; i < arguments.length; i++) {
        construct(`\x1b[1;32m[  INFO  ]:  ` + arguments[i]);
        writeFile(`[  INFO  ]:  ` + arguments[i]);
    }
}

//===========================================================//
/**
 * @param  {...String} arguments 
 */
function Message() {
    for(let i = 0; i < arguments.length; i++) {
        construct(`\x1b[0m[ MESSAGE ]: ` + arguments[i]);
        writeFile(`[ MESSAGE ]: ` + arguments[i]);
    }
}

//===========================================================//
/**
 * @param  {...String} arguments 
 */
function Success() {
    for(let i = 0; i < arguments.length; i++) {
        construct(`\x1b[1;36m[ SUCCESS ]: ` + arguments[i]);
        writeFile(`[ SUCCESS ]: ` + arguments[i]);
    }
}

//===========================================================//
/**
 * @param  {...String} arguments 
 */
function Warning() {
    for(let i = 0; i < arguments.length; i++) {
        construct(`\x1b[1;33m[ WARNING ]: ` + arguments[i]);
        writeFile(`[ WARNING ]: ` + arguments[i]);
    }
}

//===========================================================//

module.exports = { Debug, Error, Info, Message, Success, Warning };

//===========================================================//
function writeFile(content) {
    let newContent = content;
    const fullPath = `${logFilePath}/${logFileName}`;

    try {
        if(!fs.existsSync(logFilePath)) {
            fs.mkdirSync(logFilePath);
            fs.writeFileSync(fullPath, new Date().toLocaleDateString() + '\r\n\r\n');
            Info(`Folder Created Successfully.`);
        }
        else if(fs.existsSync(fullPath)) {
            fs.readFile(fullPath, 'utf-8', (err, data) => {
                if(err) return Error(err);
                newContent = data + content;
            });
        }
    } catch (err) { 
        Error(err) 
    }

    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    fs.appendFile(fullPath, `[ ${date} ][ ${time} ]` + newContent + "\r\n", function(err) {
        if(err) return Error(err);
    });
}

//===========================================================//
function construct(str) {
    const time = new Date().toLocaleTimeString();
    return console.log(`[ \x1b[1;36m${time}\x1b[0m ]` + str + `\x1b[0m`);
}