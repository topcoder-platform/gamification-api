import { MigrationFn } from 'umzug';
import { v4 as uuidv4 } from 'uuid';

export const up: MigrationFn = async ({ context: DB }: any) => {
  const orgId = uuidv4();
  await DB.organization.create({
    id: orgId,
    name: 'Topcoder',
  });
  await DB.tags.create({
    id: uuidv4(),
    organization_id: orgId,
    tag_value: 'TCO',
  });
};

export const down: MigrationFn = async ({ context: DB }: any) => {
  await DB.organization.truncate({ cascade: true });
  await DB.tags.truncate({ cascade: true });
};
