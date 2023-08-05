const { Error } = require("../../Structures/Utilities/Logger");

module.exports = {
    name: "error",
    execute(error) {
        Error(error);
    }
}