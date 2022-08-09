import * as Sequelize from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import type { badge_custom_fields, badge_custom_fieldsId } from './badge_custom_fields';
import type { organization_badges, organization_badgesId } from './organization_badges';
import type { tags, tagsId } from './tags';

export interface organizationAttributes {
  id: string;
  name: string;
}

export type organizationPk = 'id';
export type organizationId = organization[organizationPk];
export type organizationCreationAttributes = organizationAttributes;

export class organization extends Model<organizationAttributes, organizationCreationAttributes> implements organizationAttributes {
  id!: string;
  name!: string;

  // organization hasMany badge_custom_fields via organization_id
  badge_custom_fields!: badge_custom_fields[];
  getBadge_custom_fields!: Sequelize.HasManyGetAssociationsMixin<badge_custom_fields>;
  setBadge_custom_fields!: Sequelize.HasManySetAssociationsMixin<badge_custom_fields, badge_custom_fieldsId>;
  addBadge_custom_field!: Sequelize.HasManyAddAssociationMixin<badge_custom_fields, badge_custom_fieldsId>;
  addBadge_custom_fields!: Sequelize.HasManyAddAssociationsMixin<badge_custom_fields, badge_custom_fieldsId>;
  createBadge_custom_field!: Sequelize.HasManyCreateAssociationMixin<badge_custom_fields>;
  removeBadge_custom_field!: Sequelize.HasManyRemoveAssociationMixin<badge_custom_fields, badge_custom_fieldsId>;
  removeBadge_custom_fields!: Sequelize.HasManyRemoveAssociationsMixin<badge_custom_fields, badge_custom_fieldsId>;
  hasBadge_custom_field!: Sequelize.HasManyHasAssociationMixin<badge_custom_fields, badge_custom_fieldsId>;
  hasBadge_custom_fields!: Sequelize.HasManyHasAssociationsMixin<badge_custom_fields, badge_custom_fieldsId>;
  countBadge_custom_fields!: Sequelize.HasManyCountAssociationsMixin;
  // organization hasMany organization_badges via organization_id
  organization_badges!: organization_badges[];
  getOrganization_badges!: Sequelize.HasManyGetAssociationsMixin<organization_badges>;
  setOrganization_badges!: Sequelize.HasManySetAssociationsMixin<organization_badges, organization_badgesId>;
  addOrganization_badge!: Sequelize.HasManyAddAssociationMixin<organization_badges, organization_badgesId>;
  addOrganization_badges!: Sequelize.HasManyAddAssociationsMixin<organization_badges, organization_badgesId>;
  createOrganization_badge!: Sequelize.HasManyCreateAssociationMixin<organization_badges>;
  removeOrganization_badge!: Sequelize.HasManyRemoveAssociationMixin<organization_badges, organization_badgesId>;
  removeOrganization_badges!: Sequelize.HasManyRemoveAssociationsMixin<organization_badges, organization_badgesId>;
  hasOrganization_badge!: Sequelize.HasManyHasAssociationMixin<organization_badges, organization_badgesId>;
  hasOrganization_badges!: Sequelize.HasManyHasAssociationsMixin<organization_badges, organization_badgesId>;
  countOrganization_badges!: Sequelize.HasManyCountAssociationsMixin;
  // organization hasMany tags via organization_id
  tags!: tags[];
  getTags!: Sequelize.HasManyGetAssociationsMixin<tags>;
  setTags!: Sequelize.HasManySetAssociationsMixin<tags, tagsId>;
  addTag!: Sequelize.HasManyAddAssociationMixin<tags, tagsId>;
  addTags!: Sequelize.HasManyAddAssociationsMixin<tags, tagsId>;
  createTag!: Sequelize.HasManyCreateAssociationMixin<tags>;
  removeTag!: Sequelize.HasManyRemoveAssociationMixin<tags, tagsId>;
  removeTags!: Sequelize.HasManyRemoveAssociationsMixin<tags, tagsId>;
  hasTag!: Sequelize.HasManyHasAssociationMixin<tags, tagsId>;
  hasTags!: Sequelize.HasManyHasAssociationsMixin<tags, tagsId>;
  countTags!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof organization {
    return organization.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'organization',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'org_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
  }
}
