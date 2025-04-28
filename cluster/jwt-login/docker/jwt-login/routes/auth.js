const express = require('express');
const router = express.Router();
const {
    getUserByNameAndRoleId,
    getAllUsersWithRoleAndSites,
    getUserAndPasswordAndSitesByUsername,
    getUserAndSitesByUsername,
    addUserObject,
    updateUserRoleById,
    updateUserAllowedSitesByUserId,
    deleteUser
} = require('../lib/users');
const {
    getAllRole,
    getRoleByName,
    deleteRole,
    addRole
} = require('../lib/role');
const {
    getAllConfig,
    getConfigByName,
    updateConfig,
    deleteConfig,
    addConfig
} = require('../lib/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {expressjwt} = require("express-jwt");
const fs = require("node:fs");

let JWT_SECRET;

try {
    JWT_SECRET = fs.readFileSync('/run/secrets/jwt.secret', 'utf8');
} catch (err) {
    console.error(err);
}

const JWT_COOKIE_NAME = "jwt_token";
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;

//display login page
router.get('/', expressjwt({
    secret: JWT_SECRET, algorithms: ["HS256"],
    credentialsRequired: false,
    getToken: (req) => {
        return req.cookies[JWT_COOKIE_NAME];
    }
}), async function(req, res, next){
    if (req?.auth?.username) {
        res.redirect('/home');
        return
    }

    const rows = await getConfigByName('allowRegistration');
    let allowRegistration = false;
    if (rows.length > 0) {
        allowRegistration = rows[0].value === "true"
    }

    // if user not found
    res.render('auth/login', {
        title: 'Login',
        username: '',
        password: '',
        allowRegistration: allowRegistration
    })
})
//display login page
router.get('/login', expressjwt({
    secret: JWT_SECRET, algorithms: ["HS256"],
    credentialsRequired: false,
    getToken: (req) => {
        return req.cookies[JWT_COOKIE_NAME];
    }
}), async function(req, res, next){
    if (req?.auth?.username) {
        res.redirect('/home');
        return
    }

    const rows = await getConfigByName('allowRegistration');
    let allowRegistration = false;
    if (rows.length > 0) {
        allowRegistration = rows[0].value === "true"
    }

    // if user not found
    res.render('auth/login', {
        title: 'Login',
        username: '',
        password: '',
        allowRegistration: allowRegistration
    })

})
//authenticate user
router.post('/authentication', async function(req, res, next) {

    const username = req.body.username;
    const password = req.body.password;

    const rows = await getUserAndPasswordAndSitesByUsername(username);

    // if user not found
    if (rows.length <= 0) {
        req.flash('error', 'Invalid username or password')
        res.redirect('/login')
    }
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        req.flash('error', 'Invalid username or password')
        res.redirect('/login')
    }
    else { // if user found
        let admin_role_id,is_admin;

        const adminIdRows = await getRoleByName("admin");
        if(adminIdRows.length !== 1) {
            admin_role_id = -1
        } else {
            admin_role_id = adminIdRows[0].id;
        }

        const isAdminIdRows = await getUserByNameAndRoleId(username, admin_role_id);
        if (isAdminIdRows.length !== 1) {
            is_admin = false;
        } else {
            is_admin = isAdminIdRows[0].username === username;
        }

        // render to views/user/edit.ejs template file
        const token = jwt.sign({
            username: user.username,
            is_admin: is_admin,
            allowed_sites: user.sites === null ? "" : user.sites
        }, JWT_SECRET, {
            expiresIn: '8h',
        });
        const now = new Date();
        const expiresDate = new Date(now.getTime() + (8*60*60*1000));
        res.cookie(JWT_COOKIE_NAME, token, {
            secure: false, //TODO: set to true
            httpOnly: true,
            domain: COOKIE_DOMAIN,
            expires: expiresDate
        });

        const referer = new URL(req.header("referer"));
        if (referer.hostname === `login.${COOKIE_DOMAIN}` && referer.searchParams.has("return_url")) {
            res.redirect(referer.searchParams.get("return_url"));
        } else {
            res.redirect('/home');
        }
    }

})
//display login page
router.get('/register', function(req, res, next){
    res.render('auth/register', {
        title: 'Registration Page',
        username: '',
        password: ''
    })
})
// user registration
router.post('/post-register', async function(req, res, next){
    req.assert('username', 'Username is required').notEmpty()   //Validate username
    req.assert('password', 'Password is required').notEmpty()   //Validate password

    const errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!
        const user = {
            username: req.sanitize('username').escape().trim(),
            password: req.sanitize('password').escape().trim()
        }

        user.password = await bcrypt.hash(user.password, 10);

        try {
            const results = await addUserObject(user);
            req.flash('success', 'You have successfully signup!');
            res.redirect('/login');
        } catch (err) {
            req.flash('error', err)

            res.render('auth/register', {
                title: 'Registration Page',
                username: '',
                password: ''
            })
        }
    } else {   //Display errors to user
        let error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.username
         * because req.param('username') is deprecated
         */
        res.render('auth/register', {
            title: 'Registration Page',
            username: req.body.username,
            password: ''
        })
    }
})
//display home page
router.get('/home', expressjwt({
    secret: JWT_SECRET, algorithms: ["HS256"],
    getToken: (req) => {
        return req.cookies[JWT_COOKIE_NAME];
    }
}), async function(req, res, next) {
    if (req.auth.username) {
        let admin_role_id,is_admin;

        const adminIdRows = await getRoleByName("admin");
        if(adminIdRows.length !== 1) {
            admin_role_id = -1
        } else {
            admin_role_id = adminIdRows[0].id;
        }

        const isAdminIdRows = await getUserByNameAndRoleId(req.auth.username, admin_role_id);
        if (isAdminIdRows.length !== 1) {
            is_admin = false;
        } else {
            is_admin = isAdminIdRows[0].username === req.auth.username;
        }

        const users = await getAllUsersWithRoleAndSites();
        const roles = await getAllRole();
        const config = await getAllConfig();

        // console.log("username: " + req.auth.username);
        // console.log("is_admin: " + is_admin);
        // console.log("users"); console.log(users);
        // console.log("roles"); console.log(roles);
        // console.log("config"); console.log(config);

        res.render('auth/home', {
            title:"Dashboard",
            username: req.auth.username,
            is_admin: is_admin,
            users: users,
            roles: roles,
            config: config
        });
    } else {
        req.flash('success', 'Please login first!');
        res.redirect('/login');
    }
});
// Logout user
router.get('/logout', function (req, res) {
    const token = req.cookies[JWT_COOKIE_NAME];
    res.cookie(JWT_COOKIE_NAME, token, {
        secure: false, //TODO: set to true
        httpOnly: true,
        domain: COOKIE_DOMAIN,
        expires: new Date(0)
    });
    res.clearCookie(JWT_COOKIE_NAME, {domain: COOKIE_DOMAIN});
    res.clearCookie('session');
    res.redirect('/login');
});

// ------------------------------------
//             API routes
// ------------------------------------
//TODO: Change password
//TODO: Add user

router.put('/api/user/:id', expressjwt({
    secret: JWT_SECRET, algorithms: ["HS256"],
    getToken: (req) => {
        return req.cookies[JWT_COOKIE_NAME];
    }
}), async function(req, res) {
    // console.log(req.auth);
    // console.log(req.body);
    // console.log(req.params.id);

    if(!req.auth.is_admin) {
        res.status(401).json({message: "Access denied", status: 401});
        return;
    }

    if(Number(req.params.id) === Number(req.body.id)) {
        const unusedRowArray1 = await updateUserRoleById(req.params.id, req.body.role_id);
        const unusedRowArray2 = await updateUserAllowedSitesByUserId(req.params.id, req.body.sites);

        res.status(200).json({message: "Successfully saved", status: 200});
    } else {
        res.status(400).json({message: "Post body and url parameter mismatch", status: 400});
    }
});

router.put('/api/config/:name', expressjwt({
    secret: JWT_SECRET, algorithms: ["HS256"],
    getToken: (req) => {
        return req.cookies[JWT_COOKIE_NAME];
    }
}), async function(req, res) {
    // console.log(req.auth);
    console.log(req.body);
    // console.log(req.params.id);

    if(!req.auth.is_admin) {
        res.status(401).json({message: "Access denied", status: 401});
        return;
    }

    if(req.params.name === req.body.name) {
        const unusedRowArray1 = await updateConfig(req.body);

        res.status(200).json({message: "Successfully saved", status: 200});
    } else {
        res.status(400).json({message: "Post body and url parameter mismatch", status: 400});
    }
});

router.delete('/api/config/:name', expressjwt({
    secret: JWT_SECRET, algorithms: ["HS256"],
    getToken: (req) => {
        return req.cookies[JWT_COOKIE_NAME];
    }
}), async function(req, res) {
    // console.log(req.auth);
    console.log(req.body);
    // console.log(req.params.id);

    if(!req.auth.is_admin) {
        res.status(401).json({message: "Access denied", status: 401});
        return;
    }

    if(req.params.name === req.body.name) {
        const unusedRowArray1 = await deleteConfig(req.body);

        res.status(200).json({message: "Successfully saved", status: 200});
    } else {
        res.status(400).json({message: "Post body and url parameter mismatch", status: 400});
    }
});

router.delete('/api/user/:id', expressjwt({
    secret: JWT_SECRET, algorithms: ["HS256"],
    getToken: (req) => {
        return req.cookies[JWT_COOKIE_NAME];
    }
}), async function(req, res) {
    // console.log(req.auth);
    console.log(req.body);
    // console.log(req.params.id);

    if(!req.auth.is_admin) {
        res.status(401).json({message: "Access denied", status: 401});
        return;
    }

    if(Number(req.params.id) === Number(req.body.id)) {
        console.log(`Deleting user id ${req.body.id}`);
        const unusedRowArray1 = await deleteUser(req.body);

        res.status(200).json({message: "Successfully saved", status: 200});
    } else {
        console.log(`Param id ${req.params.id} does not match body id ${req.body.id}`);
        res.status(400).json({message: "Post body and url parameter mismatch", status: 400});
    }
});

router.delete('/api/role/:id', expressjwt({
    secret: JWT_SECRET, algorithms: ["HS256"],
    getToken: (req) => {
        return req.cookies[JWT_COOKIE_NAME];
    }
}), async function(req, res) {
    // console.log(req.auth);
    console.log(req.body);
    // console.log(req.params.id);

    if(!req.auth.is_admin) {
        res.status(401).json({message: "Access denied", status: 401});
        return;
    }

    if(Number(req.params.id) === Number(req.body.id)) {
        console.log(`Deleting role id ${req.body.id}`);
        const unusedRowArray1 = await deleteRole(req.body);

        res.status(200).json({message: "Successfully saved", status: 200});
    } else {
        console.log(`Param id ${req.params.id} does not match body id ${req.body.id}`);
        res.status(400).json({message: "Post body and url parameter mismatch", status: 400});
    }
});

router.post('/api/role', expressjwt({
    secret: JWT_SECRET, algorithms: ["HS256"],
    getToken: (req) => {
        return req.cookies[JWT_COOKIE_NAME];
    }
}), async function(req, res) {
    // console.log(req.auth);
    console.log(req.body);
    // console.log(req.params.id);

    if(!req.auth.is_admin) {
        res.status(401).json({message: "Access denied", status: 401});
        return;
    }

    try {
        const unusedRowArray1 = await addRole(req.body.name);
        res.status(200).json({message: "Successfully saved", status: 200});
    } catch(e) {
        res.status(400).json({message: "Post body and url parameter mismatch", status: 400});
    }
});

router.post('/api/config', expressjwt({
    secret: JWT_SECRET, algorithms: ["HS256"],
    getToken: (req) => {
        return req.cookies[JWT_COOKIE_NAME];
    }
}), async function(req, res) {
    // console.log(req.auth);
    console.log(req.body);
    // console.log(req.params.id);

    if(!req.auth.is_admin) {
        res.status(401).json({message: "Access denied", status: 401});
        return;
    }

    try {
        const unusedRowArray1 = await addConfig(req.body.name, req.body.value);
        res.status(200).json({message: "Successfully saved", status: 200});
    } catch(e) {
        res.status(400).json({message: "Post body and url parameter mismatch", status: 400});
    }
});

router.get('/authorize', expressjwt({
    secret: JWT_SECRET, algorithms: ["HS256"],
    getToken: (req) => {
        return req.cookies[JWT_COOKIE_NAME];
    }
}), async function(req, res, next) {
    if (req.auth.username) {
        const userInfo = await getUserAndSitesByUsername(req.auth.username);
        if(userInfo.length === 0) {
            res.status(403).send(); //logged in but don't have any allowed sites = Forbidden
            return;
        }

        const refererUrl = req.header("referer") || `https://www.${COOKIE_DOMAIN}`;
        if(!refererUrl.includes(COOKIE_DOMAIN)) {
            res.status(403).send(); //logged in but referer is not the cookie domain = Forbidden
            return;
        }

        const referer = new URL(refererUrl);
        const app = referer.hostname.split(".")[0];
        const allowedSites = userInfo[0].sites.split(",");

        console.log(`Validating if user can use ${app}`);
        console.log(userInfo[0]);

        if(allowedSites.includes(app)) {
            res.status(200).send(); //logged in, has allowed site
        } else {
            res.status(401).send(); //logged in but don't have the required allowed sites = Unauthorized
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;