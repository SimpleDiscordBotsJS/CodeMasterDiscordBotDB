const { Info } = require("../Utilities/Logger");
const { loadFiles } = require("../Functions/fileLoader");
const { AsciiTable3 } = require("ascii-table3");
const table = new AsciiTable3().setHeading("Commands", "Status");

async function loadCommands(client) {
    console.time("Commands Loaded");

    const files = await loadFiles("./Commands");

    client.commands = new Map();

    const commandsArray = new Array();

    for (const file of files) { 
        try { 
            const command = require(file);
            client.commands.set(command.data.name, command);
        
            commandsArray.push(command.data.toJSON());
        
            table.addRow(command.data.name, "✔");
        } catch (error) {
            table.addRow(file.split("/").pop().slice(0, -3), "✘");
            console.log(error)
        }
    }

    client.application.commands.set(commandsArray);

    Info("\n" + table.toString() + "\nCommands Loaded.");
    table.clearRows();
    console.timeEnd("Commands Loaded");
}

module.exports = { loadCommands };