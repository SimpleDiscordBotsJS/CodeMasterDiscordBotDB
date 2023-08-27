const { Info } = require("../Utilities/Logger");
const { loadFiles } = require("../Functions/fileLoader");
const { AsciiTable3 } = require("ascii-table3");
const table = new AsciiTable3().setHeading("Modals", "Status");

async function loadModals(client) {
    console.time("Modals Loaded");

    const files = await loadFiles("./Interaction/Modals");

    for (const file of files) { 
        try { 
            const modal = require(file);
            if(!modal.id) return;

            client.modals.set(modal.id, modal);
        
            table.addRow(modal.id, "✔");
        } catch (error) {
            table.addRow(file.split("/").pop().slice(0, -3), "✘");
            console.log(error)
        }
    }

    Info("\n" + table.toString() + "\nModals Loaded.");
    table.clearRows();
    console.timeEnd("Modals Loaded");
}

module.exports = { loadModals };