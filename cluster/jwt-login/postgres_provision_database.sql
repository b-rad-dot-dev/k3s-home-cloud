-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Create role table
CREATE TABLE IF NOT EXISTS role (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- Create user_role table
CREATE TABLE IF NOT EXISTS user_role (
  user_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL,
  PRIMARY KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
);

-- Create user_allowed_sites table
CREATE TABLE IF NOT EXISTS user_allowed_sites (
  user_id INTEGER NOT NULL,
  sites VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create config table
CREATE TABLE IF NOT EXISTS config (
  name VARCHAR(255) PRIMARY KEY,
  value VARCHAR(255) NOT NULL
);

INSERT INTO config(name,value) VALUES('allowRegistration','true');
INSERT INTO role(name) VALUES('admin');
INSERT INTO role(name) VALUES('user');

-- Placeholder password: password
INSERT INTO users(username,password) VALUES('admin','$2b$10$hrh0axe/sXK9mNZ4G9MnaOEMP3liTzXg24.iwP7AracmgO6l3VqUm');
INSERT INTO user_role(user_id, role_id) VALUES((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM role WHERE name = 'admin'));
INSERT INTO user_allowed_sites(user_id, sites) VALUES((SELECT id FROM users WHERE username = 'admin'), 'emby,status,comfyui');

-- Placeholder password: password
INSERT INTO users(username,password) VALUES('user','$2b$10$hrh0axe/sXK9mNZ4G9MnaOEMP3liTzXg24.iwP7AracmgO6l3VqUm');
INSERT INTO user_role(user_id, role_id) VALUES((SELECT id FROM users WHERE username = 'user'), (SELECT id FROM role WHERE name = 'user'));