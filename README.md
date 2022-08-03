# gamification-api
API supporting the Gamification project at Topcoder.

## How to sync db models used by the Sequelize ORM with latest db structure?
When changes/migrations affect the database schema structure the ORM models need to reflect and update accordingly. We use an automated approach to solve this need. There is a tool in npm, named [sequelize-auto](https://www.npmjs.com/package/sequelize-auto) which is installed as a dev dependency.

In project root type:

`sequelize-auto -o "./src/db/models" -d tc_gamification -h localhost -u postgres -p 5432 -x postgres -e postgres -l ts`

Replce the login credentials if needed for your local environment.
This command will execute and update the typescript files in the src/db/models folder.