CREATE DATABASE IF NOT EXISTS `jwt_app` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `jwt_app`;

CREATE TABLE IF NOT EXISTS `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL,
    `password` varchar(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `role` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `user_role` (
    `user_id` int(11) NOT NULL,
    `role_id` int(11) NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `user_allowed_sites` (
    `user_id` int(11) NOT NULL,
    `sites` varchar(255) NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `config` (
    `name` varchar(255) NOT NULL,
    `value` varchar(255) NOT NULL,
    PRIMARY KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO config(name,value) VALUES("allowRegistration","true");
INSERT INTO role(name) VALUES("admin");
INSERT INTO role(name) VALUES("user");

-- Placeholder password: password
INSERT INTO users(username,password) VALUES("admin","$2b$10$hrh0axe/sXK9mNZ4G9MnaOEMP3liTzXg24.iwP7AracmgO6l3VqUm");
INSERT INTO user_role(user_id, role_id) VALUES((SELECT id FROM users WHERE username = "admin"), (SELECT id FROM role WHERE name = "admin"));
INSERT INTO user_allowed_sites(user_id, sites) VALUES((SELECT id FROM users WHERE username = "admin"), "emby,status,comfyui");

-- Placeholder password: password
INSERT INTO users(username,password) VALUES("user","$2b$10$hrh0axe/sXK9mNZ4G9MnaOEMP3liTzXg24.iwP7AracmgO6l3VqUm");
INSERT INTO user_role(user_id, role_id) VALUES((SELECT id FROM users WHERE username = "user"), (SELECT id FROM role WHERE name = "user"));