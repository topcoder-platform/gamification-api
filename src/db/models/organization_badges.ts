import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { badge_custom_fields, badge_custom_fieldsId } from './badge_custom_fields';
import type { member_badges, member_badgesId } from './member_badges';
import type { organization, organizationId } from './organization';
import type { organization_badges_custom_fields, organization_badges_custom_fieldsId } from './organization_badges_custom_fields';
import type { organization_badges_tags, organization_badges_tagsId } from './organization_badges_tags';
import type { tags, tagsId } from './tags';

export interface organization_badgesAttributes {
  id: string;
  organization_id: string;
  badge_status: string;
  badge_name: string;
  badge_description?: string;
  badge_image_url: string;
}

export type organization_badgesPk = 'id';
export type organization_badgesId = organization_badges[organization_badgesPk];
export type organization_badgesOptionalAttributes = 'badge_description';
export type organization_badgesCreationAttributes = Optional<organization_badgesAttributes, organization_badgesOptionalAttributes>;

export class organization_badges
  extends Model<organization_badgesAttributes, organization_badgesCreationAttributes>
  implements organization_badgesAttributes
{
  id!: string;
  organization_id!: string;
  badge_status!: string;
  badge_name!: string;
  badge_description?: string;
  badge_image_url!: string;

  // organization_badges belongsTo organization via organization_id
  organization!: organization;
  getOrganization!: Sequelize.BelongsToGetAssociationMixin<organization>;
  setOrganization!: Sequelize.BelongsToSetAssociationMixin<organization, organizationId>;
  createOrganization!: Sequelize.BelongsToCreateAssociationMixin<organization>;
  // organization_badges belongsToMany badge_custom_fields via badges_id and custom_field_id
  custom_field_id_badge_custom_fields!: badge_custom_fields[];
  getCustom_field_id_badge_custom_fields!: Sequelize.BelongsToManyGetAssociationsMixin<badge_custom_fields>;
  setCustom_field_id_badge_custom_fields!: Sequelize.BelongsToManySetAssociationsMixin<badge_custom_fields, badge_custom_fieldsId>;
  addCustom_field_id_badge_custom_field!: Sequelize.BelongsToManyAddAssociationMixin<badge_custom_fields, badge_custom_fieldsId>;
  addCustom_field_id_badge_custom_fields!: Sequelize.BelongsToManyAddAssociationsMixin<badge_custom_fields, badge_custom_fieldsId>;
  createCustom_field_id_badge_custom_field!: Sequelize.BelongsToManyCreateAssociationMixin<badge_custom_fields>;
  removeCustom_field_id_badge_custom_field!: Sequelize.BelongsToManyRemoveAssociationMixin<badge_custom_fields, badge_custom_fieldsId>;
  removeCustom_field_id_badge_custom_fields!: Sequelize.BelongsToManyRemoveAssociationsMixin<badge_custom_fields, badge_custom_fieldsId>;
  hasCustom_field_id_badge_custom_field!: Sequelize.BelongsToManyHasAssociationMixin<badge_custom_fields, badge_custom_fieldsId>;
  hasCustom_field_id_badge_custom_fields!: Sequelize.BelongsToManyHasAssociationsMixin<badge_custom_fields, badge_custom_fieldsId>;
  countCustom_field_id_badge_custom_fields!: Sequelize.BelongsToManyCountAssociationsMixin;
  // organization_badges hasMany member_badges via org_badge_id
  member_badges!: member_badges[];
  getMember_badges!: Sequelize.HasManyGetAssociationsMixin<member_badges>;
  setMember_badges!: Sequelize.HasManySetAssociationsMixin<member_badges, member_badgesId>;
  addMember_badge!: Sequelize.HasManyAddAssociationMixin<member_badges, member_badgesId>;
  addMember_badges!: Sequelize.HasManyAddAssociationsMixin<member_badges, member_badgesId>;
  createMember_badge!: Sequelize.HasManyCreateAssociationMixin<member_badges>;
  removeMember_badge!: Sequelize.HasManyRemoveAssociationMixin<member_badges, member_badgesId>;
  removeMember_badges!: Sequelize.HasManyRemoveAssociationsMixin<member_badges, member_badgesId>;
  hasMember_badge!: Sequelize.HasManyHasAssociationMixin<member_badges, member_badgesId>;
  hasMember_badges!: Sequelize.HasManyHasAssociationsMixin<member_badges, member_badgesId>;
  countMember_badges!: Sequelize.HasManyCountAssociationsMixin;
  // organization_badges hasMany organization_badges_custom_fields via badges_id
  organization_badges_custom_fields!: organization_badges_custom_fields[];
  getOrganization_badges_custom_fields!: Sequelize.HasManyGetAssociationsMixin<organization_badges_custom_fields>;
  setOrganization_badges_custom_fields!: Sequelize.HasManySetAssociationsMixin<
    organization_badges_custom_fields,
    organization_badges_custom_fieldsId
  >;
  addOrganization_badges_custom_field!: Sequelize.HasManyAddAssociationMixin<organization_badges_custom_fields, organization_badges_custom_fieldsId>;
  addOrganization_badges_custom_fields!: Sequelize.HasManyAddAssociationsMixin<
    organization_badges_custom_fields,
    organization_badges_custom_fieldsId
  >;
  createOrganization_badges_custom_field!: Sequelize.HasManyCreateAssociationMixin<organization_badges_custom_fields>;
  removeOrganization_badges_custom_field!: Sequelize.HasManyRemoveAssociationMixin<
    organization_badges_custom_fields,
    organization_badges_custom_fieldsId
  >;
  removeOrganization_badges_custom_fields!: Sequelize.HasManyRemoveAssociationsMixin<
    organization_badges_custom_fields,
    organization_badges_custom_fieldsId
  >;
  hasOrganization_badges_custom_field!: Sequelize.HasManyHasAssociationMixin<organization_badges_custom_fields, organization_badges_custom_fieldsId>;
  hasOrganization_badges_custom_fields!: Sequelize.HasManyHasAssociationsMixin<
    organization_badges_custom_fields,
    organization_badges_custom_fieldsId
  >;
  countOrganization_badges_custom_fields!: Sequelize.HasManyCountAssociationsMixin;
  // organization_badges hasMany organization_badges_tags via organization_badges_id
  organization_badges_tags!: organization_badges_tags[];
  getOrganization_badges_tags!: Sequelize.HasManyGetAssociationsMixin<organization_badges_tags>;
  setOrganization_badges_tags!: Sequelize.HasManySetAssociationsMixin<organization_badges_tags, organization_badges_tagsId>;
  addOrganization_badges_tag!: Sequelize.HasManyAddAssociationMixin<organization_badges_tags, organization_badges_tagsId>;
  addOrganization_badges_tags!: Sequelize.HasManyAddAssociationsMixin<organization_badges_tags, organization_badges_tagsId>;
  createOrganization_badges_tag!: Sequelize.HasManyCreateAssociationMixin<organization_badges_tags>;
  removeOrganization_badges_tag!: Sequelize.HasManyRemoveAssociationMixin<organization_badges_tags, organization_badges_tagsId>;
  removeOrganization_badges_tags!: Sequelize.HasManyRemoveAssociationsMixin<organization_badges_tags, organization_badges_tagsId>;
  hasOrganization_badges_tag!: Sequelize.HasManyHasAssociationMixin<organization_badges_tags, organization_badges_tagsId>;
  hasOrganization_badges_tags!: Sequelize.HasManyHasAssociationsMixin<organization_badges_tags, organization_badges_tagsId>;
  countOrganization_badges_tags!: Sequelize.HasManyCountAssociationsMixin;
  // organization_badges belongsToMany tags via organization_badges_id and tags_id
  tags_id_tags!: tags[];
  getTags_id_tags!: Sequelize.BelongsToManyGetAssociationsMixin<tags>;
  setTags_id_tags!: Sequelize.BelongsToManySetAssociationsMixin<tags, tagsId>;
  addTags_id_tag!: Sequelize.BelongsToManyAddAssociationMixin<tags, tagsId>;
  addTags_id_tags!: Sequelize.BelongsToManyAddAssociationsMixin<tags, tagsId>;
  createTags_id_tag!: Sequelize.BelongsToManyCreateAssociationMixin<tags>;
  removeTags_id_tag!: Sequelize.BelongsToManyRemoveAssociationMixin<tags, tagsId>;
  removeTags_id_tags!: Sequelize.BelongsToManyRemoveAssociationsMixin<tags, tagsId>;
  hasTags_id_tag!: Sequelize.BelongsToManyHasAssociationMixin<tags, tagsId>;
  hasTags_id_tags!: Sequelize.BelongsToManyHasAssociationsMixin<tags, tagsId>;
  countTags_id_tags!: Sequelize.BelongsToManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof organization_badges {
    return organization_badges.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          unique: 'org_badge_unique_key',
        },
        organization_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'organization',
            key: 'id',
          },
          unique: 'org_badge_unique_key',
        },
        badge_status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        badge_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        badge_description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        badge_image_url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'organization_badges',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'org_badge_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'org_badge_unique_key',
            unique: true,
            fields: [{ name: 'id' }, { name: 'organization_id' }],
          },
        ],
      },
    );
  }
}
