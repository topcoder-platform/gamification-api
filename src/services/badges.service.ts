import DB from '@/db';
import { CreateBadgeDto, GetBadgesQueryDto, GetMemberBadgesQueryDto } from '@/dtos/badges.dto';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_PAGE_LIMIT } from '@config';
import { has } from 'lodash';
import { getMemberInfoByHandle } from '@services/members.service';

/**
 * Creates new badge under the provided organization
 * @param badge New badge payload
 * @returns Promise
 */
export async function createBadge(badge: CreateBadgeDto) {
  const exists = await DB.organization_badges.findOne({
    where: {
      organization_id: badge.organization_id,
      badge_name: badge.badge_name
    }
  });
  if (exists) {
    throw new Error('Badge with that name already exists in the organization.');
  }

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
    order: [
      ['badge_name', 'ASC'], // order by badge_name, default
    ],
  };
  // filter by org_id if present
  if (query.organization_id) {
    dbQuery.where = {
      organization_id: query.organization_id,
    };
  }
  // check for order params
  if (query.order_by || query.order_type) {
    dbQuery.order = [[query.order_by || 'badge_name', query.order_type || 'ASC']];
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
export async function assignBadge(badge_id: string, member_id: string, awarded_by: string, user_handle: string) {
  return DB.member_badges.create({
    user_id: member_id,
    org_badge_id: badge_id,
    awarded_at: new Date(),
    awarded_by,
    user_handle,
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
      where: {
        active: true, // return only active badges by default
      },
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
    dbQuery.include.where.organization_id = query.organization_id;
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
  // active filtering
  if (query.active_filter) {
    if (query.active_filter === 'all') {
      delete dbQuery.include.where.active;
    }
    if (query.active_filter === 'not_active') {
      dbQuery.include.where.active = false;
    }
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

// used to cache calls for finding user ids from tc_handles
const HANDLE_ID_MAP = {};
/**
 * Bulk import badge assignments
 * @param records the data
 * @returns Promise
 */
export async function bulkAssignBadges(records: [{ user_handle: string; org_badge_id: string; awarded_at: Date; awarded_by: string }]) {
  // process the records,
  // - find user_id from user_handle
  // - find badge_id from badge_name
  const bulkRecords = [];
  for (const r of records) {
    const newR: any = r;
    // check if we have the user_id of this handle?
    if (has(HANDLE_ID_MAP, r.user_handle)) {
      // yes - use it
      newR.user_id = HANDLE_ID_MAP[r.user_handle];
    } else {
      // no - find it
      try {
        const userInfo = await getMemberInfoByHandle(r.user_handle);
        // check if active member
        if (userInfo.status !== 'ACTIVE') throw new Error(`Member ${r.user_handle} is not in ACTIVE status`);
        // all good - use the id
        newR.user_id = userInfo.userId;
        HANDLE_ID_MAP[r.user_handle] = userInfo.userId;
      } catch (e) {
        throw new Error(`couldn't find any data for handle: ${r.user_handle}`);
      }
    }
    // store in temp
    bulkRecords.push(newR);
  }
  // store in db
  console.log('bulk create', bulkRecords);
  return DB.member_badges.bulkCreate(bulkRecords);
}
