import { MigrationFn } from 'umzug';
import fs from 'fs';
import path from 'path';

export const up: MigrationFn = async ({ context: queryInterface }: any) => {
  const schemaSQL = fs.readFileSync(path.resolve(__dirname, '../docs/erd.sql'), 'utf8');
  console.log('Starting init-db UP migration...');

  await queryInterface.query(schemaSQL);
};

export const down: MigrationFn = async ({ context: queryInterface }: any) => {
  console.log('Starting init-bd DOWN migration...');
  await queryInterface.query('DROP TABLE organization_badges CASCADE');
  await queryInterface.query('DROP TABLE organization CASCADE');
  await queryInterface.drop();
};
