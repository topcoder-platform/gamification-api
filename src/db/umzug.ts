import { Umzug, SequelizeStorage } from 'umzug';
import DB from './index';

export const migrator = new Umzug({
  migrations: {
    glob: ['migrations/*.ts', { cwd: __dirname }],
  },
  context: DB.sequelize,
  storage: new SequelizeStorage({
    sequelize: DB.sequelize,
  }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;

export const seeder = new Umzug({
  migrations: {
    glob: ['seeders/*.ts', { cwd: __dirname }],
  },
  context: DB,
  storage: new SequelizeStorage({
    sequelize: DB.sequelize,
    modelName: 'SeederMeta',
  }),
  logger: console,
});

export type Seeder = typeof seeder._types.migration;
