#!/bin/bash

HOST=10.0.0.15
USERNAME=postgres

psql -U "${USERNAME}" -h "${HOST}" -d postgres -f postgres_create_database.sql
psql -U "${USERNAME}" -h "${HOST}" -d jwt_app -f postgres_provision_database.sql
