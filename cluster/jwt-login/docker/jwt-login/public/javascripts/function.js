function getObjectFromRowNumber(formName, rowNumber) {
    const form = document.getElementById(formName);
    const row = form.getElementsByTagName("tbody")[0]
                    .getElementsByTagName("tr")[rowNumber];
    const cells = row.getElementsByTagName("td");
    if(formName === "users") {
        return buildUserObject(cells);
    } else if(formName === "roles") {
        return buildRoleObject(cells);
    } else if(formName === "configs") {
        return buildConfigObject(cells);
    }
}

function buildUserObject(rowCells) {
    const user = {
        id: Number(rowCells[0].textContent),
        username: rowCells[1].textContent,
        role_id: Number(rowCells[2].getElementsByTagName("select")[0].value),
        sites: rowCells[3].getElementsByTagName("input")[0].value
    };
    return user;
}

function buildRoleObject(rowCells) {
    const role = {
        id: Number(rowCells[0].textContent),
        name: rowCells[1].textContent
    };
    return role;
}

function buildConfigObject(rowCells) {
    const config = {
        name: rowCells[0].textContent,
        value: rowCells[1].getElementsByTagName("input")[0].value
    };
    return config;
}

//-----------------------------------------------------------------
//TODO: Add ability to add a user from admin page
//TODO: Add ability to change your user from home

function saveUser(row) {
    const user = getObjectFromRowNumber("users", row);
    console.log("Save User:");
    console.log(user);
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    }
    fetch(`api/user/${user.id}`, requestOptions)
        .then(response => response.json())
        .then(data => console.log);
}

function deleteUser(row) {
    const user = getObjectFromRowNumber("users", row);
    console.log("Delete User:");
    console.log(user);
    const requestOptions = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    }
    fetch(`api/user/${user.id}`, requestOptions)
        .then(response => response.json())
        .then(data => console.log);
}

function addRole() {
    const form = document.getElementById("addRole");
    const roleInput =form.getElementsByTagName("input")[0];
    const role = {
        name: roleInput.value
    }
    console.log("addRole");
    console.log(role);
    roleInput.value = "";
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(role)
    }
    fetch(`api/role`, requestOptions)
        .then(response => response.json())
        .then(data => console.log);
}

function deleteRole(row) {
    const role = getObjectFromRowNumber("roles", row);
    console.log("Delete Role:");
    console.log(role);
    const requestOptions = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(role)
    }
    fetch(`api/role/${role.id}`, requestOptions)
        .then(response => response.json())
        .then(data => console.log);
}

function addConfig() {
    const form = document.getElementById("addConfig");
    const nameInput =form.getElementsByTagName("input")[0];
    const valueInput =form.getElementsByTagName("input")[1];
    const config = {
        name: nameInput.value,
        value: valueInput.value
    }
    console.log("addConfig");
    console.log(config);
    nameInput.value = "";
    valueInput.value = "";
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(config)
    }
    fetch(`api/config`, requestOptions)
        .then(response => response.json())
        .then(data => console.log);
}

function saveConfig(row) {
    const config = getObjectFromRowNumber("configs", row);
    console.log("Save Config:");
    console.log(config);
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(config)
    }
    fetch(`api/config/${config.name}`, requestOptions)
        .then(response => response.json())
        .then(data => console.log);
}

function deleteConfig(row) {
    const config = getObjectFromRowNumber("configs", row);
    console.log("Delete Config:");
    console.log(config);
    const requestOptions = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(config)
    }
    fetch(`api/config/${config.name}`, requestOptions)
        .then(response => response.json())
        .then(data => console.log);
}