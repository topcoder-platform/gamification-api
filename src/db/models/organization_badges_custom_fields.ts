import * as Sequelize from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import type { badge_custom_fields, badge_custom_fieldsId } from './badge_custom_fields';
import type { organization_badges, organization_badgesId } from './organization_badges';

export interface organization_badges_custom_fieldsAttributes {
  custom_field_id: string;
  badges_id: string;
}

export type organization_badges_custom_fieldsPk = 'custom_field_id' | 'badges_id';
export type organization_badges_custom_fieldsId = organization_badges_custom_fields[organization_badges_custom_fieldsPk];
export type organization_badges_custom_fieldsCreationAttributes = organization_badges_custom_fieldsAttributes;

export class organization_badges_custom_fields
  extends Model<organization_badges_custom_fieldsAttributes, organization_badges_custom_fieldsCreationAttributes>
  implements organization_badges_custom_fieldsAttributes
{
  custom_field_id!: string;
  badges_id!: string;

  // organization_badges_custom_fields belongsTo badge_custom_fields via custom_field_id
  custom_field!: badge_custom_fields;
  getCustom_field!: Sequelize.BelongsToGetAssociationMixin<badge_custom_fields>;
  setCustom_field!: Sequelize.BelongsToSetAssociationMixin<badge_custom_fields, badge_custom_fieldsId>;
  createCustom_field!: Sequelize.BelongsToCreateAssociationMixin<badge_custom_fields>;
  // organization_badges_custom_fields belongsTo organization_badges via badges_id
  badge!: organization_badges;
  getBadge!: Sequelize.BelongsToGetAssociationMixin<organization_badges>;
  setBadge!: Sequelize.BelongsToSetAssociationMixin<organization_badges, organization_badgesId>;
  createBadge!: Sequelize.BelongsToCreateAssociationMixin<organization_badges>;

  static initModel(sequelize: Sequelize.Sequelize): typeof organization_badges_custom_fields {
    return organization_badges_custom_fields.init(
      {
        custom_field_id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'badge_custom_fields',
            key: 'field_def_id',
          },
        },
        badges_id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'organization_badges',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'organization_badges_custom_fields',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'organization_badges_custom_fields_pkey',
            unique: true,
            fields: [{ name: 'badges_id' }, { name: 'custom_field_id' }],
          },
        ],
      },
    );
  }
}
