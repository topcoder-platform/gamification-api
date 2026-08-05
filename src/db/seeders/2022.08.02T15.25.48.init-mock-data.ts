import { MigrationFn } from 'umzug';
import { randomUUID } from 'crypto';

export const up: MigrationFn = async ({ context: DB }: any) => {
  const orgId = randomUUID();
  await DB.organization.create({
    id: orgId,
    name: 'Topcoder.com',
  });

  console.log(' ---\n', 'New organization created in db:', orgId, '\n', '---');

  await DB.tags.create({
    id: randomUUID(),
    organization_id: orgId,
    tag_value: 'TCO',
  });
};

export const down: MigrationFn = async ({ context: DB }: any) => {
  await DB.organization.truncate({ cascade: true });
  await DB.tags.truncate({ cascade: true });
};
