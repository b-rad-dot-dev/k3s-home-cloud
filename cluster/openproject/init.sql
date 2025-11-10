CREATE DATABASE openproject;
CREATE USER openproject_user WITH PASSWORD '<replace me>';
GRANT ALL PRIVILEGES ON DATABASE openproject TO openproject_user;
-- \connect openproject
GRANT ALL PRIVILEGES ON SCHEMA public TO openproject_user;