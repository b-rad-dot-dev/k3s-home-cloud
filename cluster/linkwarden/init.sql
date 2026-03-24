CREATE DATABASE linkwarden;
CREATE USER linkwarden_user WITH PASSWORD '<replace me>';
GRANT ALL PRIVILEGES ON DATABASE linkwarden TO linkwarden_user;
-- \connect linkwarden
GRANT ALL PRIVILEGES ON SCHEMA public TO linkwarden_user;