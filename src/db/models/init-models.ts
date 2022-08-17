import type { Sequelize } from 'sequelize';
import { badge_custom_fields as _badge_custom_fields } from './badge_custom_fields';
import type { badge_custom_fieldsAttributes, badge_custom_fieldsCreationAttributes } from './badge_custom_fields';
import { member_badges as _member_badges } from './member_badges';
import type { member_badgesAttributes, member_badgesCreationAttributes } from './member_badges';
import { organization as _organization } from './organization';
import type { organizationAttributes, organizationCreationAttributes } from './organization';
import { organization_badges as _organization_badges } from './organization_badges';
import type { organization_badgesAttributes, organization_badgesCreationAttributes } from './organization_badges';
import { organization_badges_custom_fields as _organization_badges_custom_fields } from './organization_badges_custom_fields';
import type {
  organization_badges_custom_fieldsAttributes,
  organization_badges_custom_fieldsCreationAttributes,
} from './organization_badges_custom_fields';
import { organization_badges_tags as _organization_badges_tags } from './organization_badges_tags';
import type { organization_badges_tagsAttributes, organization_badges_tagsCreationAttributes } from './organization_badges_tags';
import { tags as _tags } from './tags';
import type { tagsAttributes, tagsCreationAttributes } from './tags';

export {
  _badge_custom_fields as badge_custom_fields,
  _member_badges as member_badges,
  _organization as organization,
  _organization_badges as organization_badges,
  _organization_badges_custom_fields as organization_badges_custom_fields,
  _organization_badges_tags as organization_badges_tags,
  _tags as tags,
};

export type {
  badge_custom_fieldsAttributes,
  badge_custom_fieldsCreationAttributes,
  member_badgesAttributes,
  member_badgesCreationAttributes,
  organizationAttributes,
  organizationCreationAttributes,
  organization_badgesAttributes,
  organization_badgesCreationAttributes,
  organization_badges_custom_fieldsAttributes,
  organization_badges_custom_fieldsCreationAttributes,
  organization_badges_tagsAttributes,
  organization_badges_tagsCreationAttributes,
  tagsAttributes,
  tagsCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const badge_custom_fields = _badge_custom_fields.initModel(sequelize);
  const member_badges = _member_badges.initModel(sequelize);
  const organization = _organization.initModel(sequelize);
  const organization_badges = _organization_badges.initModel(sequelize);
  const organization_badges_custom_fields = _organization_badges_custom_fields.initModel(sequelize);
  const organization_badges_tags = _organization_badges_tags.initModel(sequelize);
  const tags = _tags.initModel(sequelize);

  badge_custom_fields.belongsToMany(organization_badges, {
    as: 'badges_id_organization_badges',
    through: organization_badges_custom_fields,
    foreignKey: 'custom_field_id',
    otherKey: 'badges_id',
  });
  organization_badges.belongsToMany(badge_custom_fields, {
    as: 'custom_field_id_badge_custom_fields',
    through: organization_badges_custom_fields,
    foreignKey: 'badges_id',
    otherKey: 'custom_field_id',
  });
  organization_badges.belongsToMany(tags, {
    as: 'tags_id_tags',
    through: organization_badges_tags,
    foreignKey: 'organization_badges_id',
    otherKey: 'tags_id',
  });
  tags.belongsToMany(organization_badges, {
    as: 'organization_badges_id_organization_badges',
    through: organization_badges_tags,
    foreignKey: 'tags_id',
    otherKey: 'organization_badges_id',
  });
  organization_badges_custom_fields.belongsTo(badge_custom_fields, { as: 'custom_field', foreignKey: 'custom_field_id' });
  badge_custom_fields.hasMany(organization_badges_custom_fields, { as: 'organization_badges_custom_fields', foreignKey: 'custom_field_id' });
  badge_custom_fields.belongsTo(organization, { as: 'organization', foreignKey: 'organization_id' });
  organization.hasMany(badge_custom_fields, { as: 'badge_custom_fields', foreignKey: 'organization_id' });
  organization_badges.belongsTo(organization, { as: 'organization', foreignKey: 'organization_id' });
  organization.hasMany(organization_badges, { as: 'organization_badges', foreignKey: 'organization_id' });
  tags.belongsTo(organization, { as: 'organization', foreignKey: 'organization_id' });
  organization.hasMany(tags, { as: 'tags', foreignKey: 'organization_id' });
  member_badges.belongsTo(organization_badges, { as: 'org_badge', foreignKey: 'org_badge_id' });
  organization_badges.hasMany(member_badges, { as: 'member_badges', foreignKey: 'org_badge_id' });
  organization_badges_custom_fields.belongsTo(organization_badges, { as: 'badge', foreignKey: 'badges_id' });
  organization_badges.hasMany(organization_badges_custom_fields, { as: 'organization_badges_custom_fields', foreignKey: 'badges_id' });
  organization_badges_tags.belongsTo(organization_badges, { as: 'organization_badge', foreignKey: 'organization_badges_id' });
  organization_badges.hasMany(organization_badges_tags, { as: 'organization_badges_tags', foreignKey: 'organization_badges_id' });
  organization_badges_tags.belongsTo(tags, { as: 'tag', foreignKey: 'tags_id' });
  tags.hasMany(organization_badges_tags, { as: 'organization_badges_tags', foreignKey: 'tags_id' });

  return {
    badge_custom_fields: badge_custom_fields,
    member_badges: member_badges,
    organization: organization,
    organization_badges: organization_badges,
    organization_badges_custom_fields: organization_badges_custom_fields,
    organization_badges_tags: organization_badges_tags,
    tags: tags,
  };
}
