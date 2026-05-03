CREATE DATABASE uptimekuma;
CREATE USER 'uptimekuma_user'@'%' IDENTIFIED BY '<replace me>';
GRANT ALL PRIVILEGES ON uptimekuma.* TO 'uptimekuma_user'@'%';
FLUSH PRIVILEGES;