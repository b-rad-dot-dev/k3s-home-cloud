const {getConnection} = require("./db");
const {getRoleByName} = require("./role");

async function getUserByNameAndRoleId(username, roleId) {
    const connection = getConnection();
    const {rows} = await connection.query("SELECT u.id, u.username FROM users u JOIN user_role ur ON u.id = ur.user_id WHERE u.username = $1 AND ur.role_id = $2 ORDER BY u.id ASC", [username, roleId]);
    return rows;
}

async function getAllUsersWithRoleAndSites() {
    const connection = getConnection();
    const {rows} = await connection.query("SELECT u.id, u.username, r.name as role_name, uas.sites, r.id as role_id FROM users u LEFT JOIN user_role ur ON u.id = ur.user_id LEFT JOIN role r ON ur.role_id = r.id LEFT JOIN user_allowed_sites uas ON u.id = uas.user_id ORDER BY u.id ASC");
    return rows;
}

async function getUserAndPasswordAndSitesByUsername(username) {
    const connection = getConnection();
    const {rows} = await connection.query("SELECT u.username, u.password, uas.sites FROM users u LEFT JOIN user_allowed_sites uas ON u.id = uas.user_id WHERE u.username = $1 ORDER BY u.id ASC", [username]);
    return rows;
}

async function getUserAndSitesByUsername(username) {
    const connection = getConnection();
    const {rows} = await connection.query("SELECT u.username, uas.sites FROM users u LEFT JOIN user_allowed_sites uas ON u.id = uas.user_id WHERE u.username = $1 ORDER BY u.id ASC", [username]);
    return rows;
}

async function addUserObject(user) {
    const connection = getConnection();
    const {rows} = await connection.query("INSERT INTO users(username, password) VALUES ($1, $2) RETURNING *", [user.username, user.password]);

    const userRole = await getRoleByName("user");
    const userRoleObj = {
        user_id: rows[0].id,
        role_id: userRole[0].id
    }
    const {rows:unused} = await connection.query("INSERT INTO user_role(user_id, role_id) VALUES ($1, $2) RETURNING *", [userRoleObj.user_id, userRoleObj.role_id]);

    return rows;
}

async function updateUserRoleById(userId, roleId) {
    const connection = getConnection();
    const {rows} = await connection.query("INSERT INTO user_role(user_id, role_id) VALUES($1, $2) ON CONFLICT(user_id) DO UPDATE SET role_id = $3 RETURNING *", [userId, roleId, roleId]);
    return rows;
}

async function updateUserAllowedSitesByUserId(userId, sites) {
    console.log(`Updating user (${userId}) to allow sites: ${sites}`);
    const connection = getConnection();
    const {rows} = await connection.query("INSERT INTO user_allowed_sites(user_id,sites) VALUES($1, $2) ON CONFLICT(user_id) DO UPDATE SET sites = $3 RETURNING *", [userId, sites, sites]);
    console.log(rows);
    return rows;
}

async function deleteUser(user) {
    const connection = getConnection();
    // Deletes from user_role and user_allowed_sites, too
    const {rows} = await connection.query("DELETE FROM users WHERE id = $1", [user.id]);
    return rows;
}

module.exports = {
    getUserByNameAndRoleId: getUserByNameAndRoleId,
    getAllUsersWithRoleAndSites: getAllUsersWithRoleAndSites,
    getUserAndPasswordAndSitesByUsername: getUserAndPasswordAndSitesByUsername,
    getUserAndSitesByUsername: getUserAndSitesByUsername,
    addUserObject: addUserObject,
    updateUserRoleById: updateUserRoleById,
    updateUserAllowedSitesByUserId: updateUserAllowedSitesByUserId,
    deleteUser: deleteUser
}