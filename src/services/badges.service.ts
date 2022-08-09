import DB from '@/db';
import { CreateBadgeDto } from '@/dtos/badges.dto';
import { v4 as uuidv4 } from 'uuid';

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
