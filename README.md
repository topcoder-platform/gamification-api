# gamification-api
API supporting the Gamification project at Topcoder.

## Quick Start
Assuming you have PostgreSQL server running locally and the database `tc_gamification` exists. If this is not the case, either install PostgreSQL server or use the docker-compose provided. See "Docker support" section how to do that.

When PostgreSQL server is ready, proceed with the commands below to get started.

1. `npm i`
2. `export GAMIFICATION_DATABASE_URL = postgres://postgres:postgres@127.0.0.1:5432/tc_gamification` - following steps require working db connection, take care to setup the URL properly and with correct credentials.
3. `npm run init-db`
4. `npm run seed-db` - optional step, assuming you want mock data for development.
5. `npm run dev`

## Docker support
WIP

## How to sync db models used by the Sequelize ORM with latest db structure?
When changes/migrations affect the database schema structure the ORM models need to reflect and update accordingly. We use an automated approach to solve this need. There is a tool in npm, named [sequelize-auto](https://www.npmjs.com/package/sequelize-auto) which is installed as a dev dependency.

In project root type:

`npm run sync-orm`

This command will execute and update the typescript files in the src/db/models folder.