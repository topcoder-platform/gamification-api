import DB from '@/db';
import { CreateBadgeDto, GetBadgesQueryDto } from '@/dtos/badges.dto';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_PAGE_LIMIT } from '@config';

/**
 * Creates new badge under the provided organization
 * @param badge New badge payload
 * @returns Promise
 */
export async function createBadge(badge: CreateBadgeDto) {
  return DB.organization_badges.create({
    id: uuidv4(),
    ...badge,
  });
}

/**
 * Get all badges in the system or partitioned by org id
 * @param organization_id scope under org id
 */
export async function getBadges(query: GetBadgesQueryDto) {
  // default query
  const dbQuery: any = {
    include: [
      {
        // include org meta
        model: DB.organization,
        as: 'organization',
      },
    ],
    offset: query.offset || 0,
    limit: query.limit || DEFAULT_PAGE_LIMIT,
  };
  // filter by org_id if present
  if (query.organization_id) {
    dbQuery.where = {
      organization_id: query.organization_id,
    };
  }

  return DB.organization_badges.findAndCountAll(dbQuery);
}
