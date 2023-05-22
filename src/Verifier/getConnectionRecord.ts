const fs = require("fs");

export const getConnectionRecord = async () => {
    const connection = JSON.parse(
        await fs.readFileSync("./connection.json", "utf-8")
    );
    if (!connection) {
        throw Error("Missing Connection Record");
    }
    return connection;
};
