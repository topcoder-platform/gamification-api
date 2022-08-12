import * as Sequelize from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import type { organization, organizationId } from './organization';
import type { organization_badges, organization_badgesId } from './organization_badges';
import type { organization_badges_tags, organization_badges_tagsId } from './organization_badges_tags';

export interface tagsAttributes {
  id: string;
  organization_id: string;
  tag_value: string;
}

export type tagsPk = 'id';
export type tagsId = tags[tagsPk];
export type tagsCreationAttributes = tagsAttributes;

export class tags extends Model<tagsAttributes, tagsCreationAttributes> implements tagsAttributes {
  id!: string;
  organization_id!: string;
  tag_value!: string;

  // tags belongsTo organization via organization_id
  organization!: organization;
  getOrganization!: Sequelize.BelongsToGetAssociationMixin<organization>;
  setOrganization!: Sequelize.BelongsToSetAssociationMixin<organization, organizationId>;
  createOrganization!: Sequelize.BelongsToCreateAssociationMixin<organization>;
  // tags belongsToMany organization_badges via tags_id and organization_badges_id
  organization_badges_id_organization_badges!: organization_badges[];
  getOrganization_badges_id_organization_badges!: Sequelize.BelongsToManyGetAssociationsMixin<organization_badges>;
  setOrganization_badges_id_organization_badges!: Sequelize.BelongsToManySetAssociationsMixin<organization_badges, organization_badgesId>;
  addOrganization_badges_id_organization_badge!: Sequelize.BelongsToManyAddAssociationMixin<organization_badges, organization_badgesId>;
  addOrganization_badges_id_organization_badges!: Sequelize.BelongsToManyAddAssociationsMixin<organization_badges, organization_badgesId>;
  createOrganization_badges_id_organization_badge!: Sequelize.BelongsToManyCreateAssociationMixin<organization_badges>;
  removeOrganization_badges_id_organization_badge!: Sequelize.BelongsToManyRemoveAssociationMixin<organization_badges, organization_badgesId>;
  removeOrganization_badges_id_organization_badges!: Sequelize.BelongsToManyRemoveAssociationsMixin<organization_badges, organization_badgesId>;
  hasOrganization_badges_id_organization_badge!: Sequelize.BelongsToManyHasAssociationMixin<organization_badges, organization_badgesId>;
  hasOrganization_badges_id_organization_badges!: Sequelize.BelongsToManyHasAssociationsMixin<organization_badges, organization_badgesId>;
  countOrganization_badges_id_organization_badges!: Sequelize.BelongsToManyCountAssociationsMixin;
  // tags hasMany organization_badges_tags via tags_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof tags {
    return tags.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          unique: 'tags_unique_key',
        },
        organization_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'organization',
            key: 'id',
          },
          unique: 'tags_unique_key',
        },
        tag_value: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: 'org_tag',
        },
      },
      {
        sequelize,
        tableName: 'tags',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'org_tag',
            unique: true,
            fields: [{ name: 'organization_id' }, { name: 'tag_value' }],
          },
          {
            name: 'tags_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'tags_unique_key',
            unique: true,
            fields: [{ name: 'id' }, { name: 'organization_id' }],
          },
        ],
      },
    );
  }
}
