const { Info } = require("../Utilities/Logger");
const { loadFiles } = require("../Functions/fileLoader");
const { AsciiTable3 } = require("ascii-table3");
const table = new AsciiTable3().setHeading("Buttons", "Status");

async function loadButtons(client) {
    console.time("Buttons Loaded");

    const files = await loadFiles("./Buttons");

    for (const file of files) { 
        try { 
            const button = require(file);
            if(!button.id) return;

            client.buttons.set(button.id, button);
        
            table.addRow(button.id, "✔");
        } catch (error) {
            table.addRow(file.split("/").pop().slice(0, -3), "✘");
            console.log(error)
        }
    }

    Info("\n" + table.toString() + "\nButtons Loaded.");
    table.clearRows();
    console.timeEnd("Buttons Loaded");
}

module.exports = { loadButtons };