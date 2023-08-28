const { Info } = require("../Utilities/Logger");
const { loadFiles } = require("../Functions/fileLoader");
const { AsciiTable3 } = require("ascii-table3");
const table = new AsciiTable3().setHeading("Selects", "Status");

async function loadSelects(client) {
    console.time("Selects Loaded");

    const files = await loadFiles("./Interactions/Select-menus");

    for (const file of files) { 
        try { 
            const select = require(file);
            if(!select.id) return;

            client.selects.set(select.id, select);
        
            table.addRow(select.id, "✔");
        } catch (error) {
            table.addRow(file.split("/").pop().slice(0, -3), "✘");
            console.log(error)
        }
    }

    Info("\n" + table.toString() + "\nSelects Loaded.");
    table.clearRows();
    console.timeEnd("Selects Loaded");
}

module.exports = { loadSelects };