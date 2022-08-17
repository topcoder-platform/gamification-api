import { Sequelize } from 'sequelize';
// https://github.com/sequelize/sequelize/issues/1774#issuecomment-126714889
require('pg').defaults.parseInt8 = true;
import { initModels } from './models/init-models';
import { POSTGRE_SQL_USER, POSTGRE_SQL_PASS, POSTGRE_SQL_DATABASE } from '@config';

const sequelize = new Sequelize(`postgres://${POSTGRE_SQL_USER}:${POSTGRE_SQL_PASS}@${POSTGRE_SQL_DATABASE}`, {
  logging: false,
  dialectOptions: {
    multipleStatements: true,
  },
});

// Put models here when needed...
const db: any = initModels(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
