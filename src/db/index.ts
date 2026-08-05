import { Sequelize } from 'sequelize';
import pg from 'pg';
// https://github.com/sequelize/sequelize/issues/1774#issuecomment-126714889
pg.defaults.parseInt8 = true;
import { initModels } from './models/init-models';

const sequelize = new Sequelize(
  `postgres://${process.env.POSTGRE_SQL_USER}:${process.env.POSTGRE_SQL_PASS}@${process.env.POSTGRE_SQL_DATABASE}?schema=${process.env.POSTGRE_SQL_SCHEMA}`,
  {
    logging: false,
    dialectOptions: {
      multipleStatements: true,
      prependSearchPath: true,
    },
    schema: process.env.POSTGRE_SQL_SCHEMA,
    searchPath: process.env.POSTGRE_SQL_SCHEMA,
  } as any,
);

// Put models here when needed...
const db: any = initModels(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
