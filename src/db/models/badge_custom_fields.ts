import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { organization, organizationId } from './organization';
import type { organization_badges, organization_badgesId } from './organization_badges';
import type { organization_badges_custom_fields, organization_badges_custom_fieldsId } from './organization_badges_custom_fields';

export interface badge_custom_fieldsAttributes {
  organization_id: string;
  field_def_id: string;
  name: string;
  value_type: string;
  text_value?: string;
  number_value?: number;
}

export type badge_custom_fieldsPk = 'field_def_id';
export type badge_custom_fieldsId = badge_custom_fields[badge_custom_fieldsPk];
export type badge_custom_fieldsOptionalAttributes = 'text_value' | 'number_value';
export type badge_custom_fieldsCreationAttributes = Optional<badge_custom_fieldsAttributes, badge_custom_fieldsOptionalAttributes>;

export class badge_custom_fields
  extends Model<badge_custom_fieldsAttributes, badge_custom_fieldsCreationAttributes>
  implements badge_custom_fieldsAttributes
{
  organization_id!: string;
  field_def_id!: string;
  name!: string;
  value_type!: string;
  text_value?: string;
  number_value?: number;

  // badge_custom_fields belongsToMany organization_badges via custom_field_id and badges_id
  badges_id_organization_badges!: organization_badges[];
  getBadges_id_organization_badges!: Sequelize.BelongsToManyGetAssociationsMixin<organization_badges>;
  setBadges_id_organization_badges!: Sequelize.BelongsToManySetAssociationsMixin<organization_badges, organization_badgesId>;
  addBadges_id_organization_badge!: Sequelize.BelongsToManyAddAssociationMixin<organization_badges, organization_badgesId>;
  addBadges_id_organization_badges!: Sequelize.BelongsToManyAddAssociationsMixin<organization_badges, organization_badgesId>;
  createBadges_id_organization_badge!: Sequelize.BelongsToManyCreateAssociationMixin<organization_badges>;
  removeBadges_id_organization_badge!: Sequelize.BelongsToManyRemoveAssociationMixin<organization_badges, organization_badgesId>;
  removeBadges_id_organization_badges!: Sequelize.BelongsToManyRemoveAssociationsMixin<organization_badges, organization_badgesId>;
  hasBadges_id_organization_badge!: Sequelize.BelongsToManyHasAssociationMixin<organization_badges, organization_badgesId>;
  hasBadges_id_organization_badges!: Sequelize.BelongsToManyHasAssociationsMixin<organization_badges, organization_badgesId>;
  countBadges_id_organization_badges!: Sequelize.BelongsToManyCountAssociationsMixin;
  // badge_custom_fields hasMany organization_badges_custom_fields via custom_field_id
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
  // badge_custom_fields belongsTo organization via organization_id
  organization!: organization;
  getOrganization!: Sequelize.BelongsToGetAssociationMixin<organization>;
  setOrganization!: Sequelize.BelongsToSetAssociationMixin<organization, organizationId>;
  createOrganization!: Sequelize.BelongsToCreateAssociationMixin<organization>;

  static initModel(sequelize: Sequelize.Sequelize): typeof badge_custom_fields {
    return badge_custom_fields.init(
      {
        organization_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'organization',
            key: 'id',
          },
          unique: 'unique_defs',
        },
        field_def_id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          unique: 'unique_defs',
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        value_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        text_value: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        number_value: {
          type: DataTypes.DECIMAL,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'badge_custom_fields',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'badge_custom_fields_pkey',
            unique: true,
            fields: [{ name: 'field_def_id' }],
          },
          {
            name: 'unique_defs',
            unique: true,
            fields: [{ name: 'organization_id' }, { name: 'field_def_id' }],
          },
        ],
      },
    );
  }
}
