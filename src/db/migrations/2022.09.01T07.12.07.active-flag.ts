import { MigrationFn } from 'umzug';

export const up: MigrationFn = async ({ context: queryInterface }: any) => {
  await queryInterface.query(`ALTER TABLE IF EXISTS public.organization_badges
  ADD COLUMN active boolean NOT NULL DEFAULT TRUE;`);
};

export const down: MigrationFn = async ({ context: queryInterface }: any) => {
  await queryInterface.query('ALTER TABLE IF EXISTS public.organization_badges DROP COLUMN IF EXISTS active;');
};
