const pg = require('pg');
const fs = require('node:fs');

let password;

try {
    password = fs.readFileSync('/run/secrets/database.password', 'utf8');
} catch (err) {
    console.error(err);
}

let connection;

function doConnect() {
    const client = new pg.Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: 'jwt_app',
        password: password,
        port: 5432,
    });
    client.connect()
        .then(conn => {
            connection = client;
            console.log("Connected :)");
        })
        .catch(err => {
           console.log("Error connecting, trying again 5 seconds...");
           setTimeout(doConnect, 5000);
        });
}
doConnect();

function getConnection() {
    return connection;
}

module.exports = {
    getConnection: getConnection
};