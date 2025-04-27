const {getConnection} = require("./db");

async function getAllRole() {
    const connection = getConnection();
    const {rows} = await connection.query("SELECT * FROM role ORDER BY id ASC");
    return rows;
}

async function getRoleByName(name) {
    const connection = getConnection();
    const {rows} = await connection.query("SELECT * FROM role WHERE name = $1 ORDER BY id ASC", [name]);
    return rows;
}

async function deleteRole(role) {
    const connection = getConnection();
    // update peoples roles to set it to user before deleting (otherwise deleting role deletes user_role too)
    const {rows:unused} = await connection.query("UPDATE user_role SET role_id = 2 where role_id = $1", [role.id]);
    const {rows} = await connection.query("DELETE FROM role WHERE id = $1", [role.id]);
    return rows;
}

async function addRole(role) {
    const connection = getConnection();
    const {rows} = await connection.query("INSERT INTO role(name) VALUES($1) RETURNING *", [role]);
    return rows;
}

module.exports = {
    getAllRole: getAllRole,
    getRoleByName: getRoleByName,
    deleteRole: deleteRole,
    addRole: addRole
}