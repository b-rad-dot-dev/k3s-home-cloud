CREATE DATABASE homebox;
CREATE USER homebox_user WITH PASSWORD '<REPLACE ME>';
GRANT ALL PRIVILEGES ON DATABASE homebox TO homebox_user;
-- \connect homebox
GRANT ALL PRIVILEGES ON SCHEMA public TO homebox_user;