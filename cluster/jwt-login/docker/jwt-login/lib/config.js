const {getConnection} = require("./db");

async function getAllConfig() {
    const connection = getConnection();
    const {rows} = await connection.query("SELECT * FROM config ORDER BY name ASC");
    return rows;
}

async function getConfigByName(name) {
    const connection = getConnection();
    const {rows} = await connection.query("SELECT * FROM config WHERE name = $1 ORDER BY name ASC", [name]);
    return rows;
}

async function updateConfig(config) {
    const connection = getConnection();
    const {rows} = await connection.query("UPDATE config SET value = $1 WHERE name = $2", [config.value, config.name]);
    return rows;
}

async function deleteConfig(config) {
    const connection = getConnection();
    const {rows} = await connection.query("DELETE FROM config WHERE name = $1", [config.name]);
    return rows;
}

async function addConfig(name, value) {
    const connection = getConnection();
    const {rows} = await connection.query("INSERT INTO config(name, value) VALUES($1,$2) RETURNING *", [name, value]);
    return rows;
}

module.exports = {
    getAllConfig: getAllConfig,
    getConfigByName: getConfigByName,
    updateConfig: updateConfig,
    deleteConfig: deleteConfig,
    addConfig: addConfig
}