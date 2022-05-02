const { Perms } = require("../Validation/Permissions");

module.exports = async(client, PG, AsciiTable3) => {
    const Table = new AsciiTable3("Command Loaded");

    CommandsArray = [];

    (await PG(`${(process.cwd().replace(/\\/g, '/'))}/Commands/*/*.js`)).map(async(file) => {
        const command = require(file);

        if(!command.name)
        return Table.addRow(file.split("/")[7], "✘ FAILED", "Missing a name.");

        if(command.type !== "USER" && !command.description) 
        return Table.addRow(command.name, "✘ FAILED", "missing a description.");

        if(command.permission) {
            if(Perms.includes(command.permission)) command.defaultPermission = false;
            else return Table.addRow(command.name, "✘ FAILED", "Permission is invalid.");
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        await Table.addRow(command.name, "✔ SUCCESSFUL");
    })

    console.log(Table.toString());

    // PERMISSIONS CHECK REMOVED //

    client.on("ready", async () => {
        client.guilds.cache.forEach((g) => {
            g.commands.set(CommandsArray);
        });
    });
}