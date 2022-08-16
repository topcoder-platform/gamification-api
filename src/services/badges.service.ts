import DB from '@/db';
import { CreateBadgeDto, GetBadgesQueryDto, GetMemberBadgesQueryDto } from '@/dtos/badges.dto';
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
 * @returns Promise
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

/**
 * Assign a badge to a member
 * @param badge_id which badge
 * @param member_id to whom
 * @param awarded_by by who
 * @returns Promise
 */
export async function assignBadge(badge_id: string, member_id: string, awarded_by: string) {
  return DB.member_badges.create({
    user_id: member_id,
    org_badge_id: badge_id,
    awarded_at: new Date(),
    awarded_by,
  });
}

/**
 * Unassign a badge to a member
 * @param badge_id which badge
 * @param member_id from whom
 * @returns Promise
 */
export async function removeBadge(badge_id: string, member_id: string) {
  return DB.member_badges.destroy({
    where: {
      user_id: member_id,
      org_badge_id: badge_id,
    },
  });
}

/**
 * Get member assigned badges
 * @param member_id The member id
 * @param query Query to run
 * @returns Promise
 */
export async function getMemberEarnedBadges(member_id: string, query: GetMemberBadgesQueryDto) {
  // default query
  const dbQuery: any = {
    where: {
      user_id: member_id,
    },
    include: {
      // include badge meta
      model: DB.organization_badges,
      as: 'org_badge',
      include: [
        {
          // include org meta
          model: DB.organization,
          as: 'organization',
        },
        {
          // include badge tags
          model: DB.tags,
          as: 'tags_id_tags',
        },
      ],
    },
    offset: query.offset || 0,
    limit: query.limit || DEFAULT_PAGE_LIMIT,
  };
  // filter by organization
  if (query.organization_id) {
    dbQuery.include.where = {
      organization_id: query.organization_id,
    };
  }
  // filter by tags
  if (query.tags) {
    dbQuery.include.include[1].where = {
      tag_value: {
        // see: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
        [DB.Sequelize.Op[query.tags_query_type || 'all']]: query.tags.split(','),
      },
    };
  }

  return DB.member_badges.findAndCountAll(dbQuery);
}

/**
 * Get a badge and all members that have earned it
 * @param badge_id badge id to query
 * @returns Promise
 */
export async function getBadgeWithMembers(badge_id: string) {
  // default query
  const dbQuery: any = {
    where: {
      id: badge_id,
    },
    include: [
      {
        // include members earned the badge
        model: DB.member_badges,
        as: 'member_badges',
      },
      {
        // include badge tags
        model: DB.tags,
        as: 'tags_id_tags',
      },
    ],
  };

  return DB.organization_badges.findOne(dbQuery);
}
