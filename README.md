# Project-2

## Usage
- `git clone` the repo.
- `cd` into the poject folder.
- `npm i` to install all the packages.
- Log in to your postgress instance and run schema file as: `\i db/schema.sql`. This will create the database for you.
- Create a `.env` file and add fields `DB_USER, DB_PASSWORD, DB_NAME={{The database you created in the previos step}}`
- Execute `npm run seed` to create the tables and seed data.
- Execute `npm run start` or `npm run watch` to start the server. NOTE: By default the server will start on PORT: 3001, you can change this in the `config/connection.js` file.