-- Create extension dblink if not exists
CREATE EXTENSION IF NOT EXISTS dblink;

-- Create database jwt_app if it doesn't exist
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'jwt_app') THEN
      PERFORM dblink_exec('dbname=' || current_database(), 'CREATE DATABASE jwt_app');
END IF;
END
$$;
