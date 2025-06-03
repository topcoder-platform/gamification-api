import * as Sequelize from 'sequelize';
import { DataTypes, Model } from 'sequelize';
import type { organization_badges, organization_badgesId } from './organization_badges';

export interface member_badgesAttributes {
  user_id: number;
  org_badge_id: string;
  awarded_at: Date;
  awarded_by: string;
  user_handle: string;
}

export type member_badgesPk = 'user_id' | 'org_badge_id';
export type member_badgesId = member_badges[member_badgesPk];
export type member_badgesCreationAttributes = member_badgesAttributes;

export class member_badges extends Model<member_badgesAttributes, member_badgesCreationAttributes> implements member_badgesAttributes {
  user_id!: number;
  org_badge_id!: string;
  awarded_at!: Date;
  awarded_by!: string;
  user_handle!: string;

  // member_badges belongsTo organization_badges via org_badge_id
  org_badge!: organization_badges;
  getOrg_badge!: Sequelize.BelongsToGetAssociationMixin<organization_badges>;
  setOrg_badge!: Sequelize.BelongsToSetAssociationMixin<organization_badges, organization_badgesId>;
  createOrg_badge!: Sequelize.BelongsToCreateAssociationMixin<organization_badges>;

  static initModel(sequelize: Sequelize.Sequelize): typeof member_badges {
    return member_badges.init(
      {
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        org_badge_id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'organization_badges',
            key: 'id',
          },
        },
        awarded_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        awarded_by: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user_handle: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'member_badges',
        schema: process.env.POSTGRE_SQL_SCHEMA,
        timestamps: false,
        indexes: [
          {
            name: 'badge_per_user',
            unique: true,
            fields: [{ name: 'user_id' }, { name: 'org_badge_id' }],
          },
        ],
      },
    );
  }
}
