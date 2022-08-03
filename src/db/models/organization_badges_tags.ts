import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { organization_badges, organization_badgesId } from './organization_badges';
import type { tags, tagsId } from './tags';

export interface organization_badges_tagsAttributes {
  tags_id: string;
  organization_badges_id: string;
}

export type organization_badges_tagsPk = 'tags_id' | 'organization_badges_id';
export type organization_badges_tagsId = organization_badges_tags[organization_badges_tagsPk];
export type organization_badges_tagsCreationAttributes = organization_badges_tagsAttributes;

export class organization_badges_tags
  extends Model<organization_badges_tagsAttributes, organization_badges_tagsCreationAttributes>
  implements organization_badges_tagsAttributes
{
  tags_id!: string;
  organization_badges_id!: string;

  // organization_badges_tags belongsTo organization_badges via organization_badges_id
  organization_badge!: organization_badges;
  getOrganization_badge!: Sequelize.BelongsToGetAssociationMixin<organization_badges>;
  setOrganization_badge!: Sequelize.BelongsToSetAssociationMixin<organization_badges, organization_badgesId>;
  createOrganization_badge!: Sequelize.BelongsToCreateAssociationMixin<organization_badges>;
  // organization_badges_tags belongsTo tags via tags_id
  tag!: tags;
  getTag!: Sequelize.BelongsToGetAssociationMixin<tags>;
  setTag!: Sequelize.BelongsToSetAssociationMixin<tags, tagsId>;
  createTag!: Sequelize.BelongsToCreateAssociationMixin<tags>;

  static initModel(sequelize: Sequelize.Sequelize): typeof organization_badges_tags {
    return organization_badges_tags.init(
      {
        tags_id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'tags',
            key: 'id',
          },
        },
        organization_badges_id: {
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
        tableName: 'organization_badges_tags',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'organization_badges_tags_pkey',
            unique: true,
            fields: [{ name: 'organization_badges_id' }, { name: 'tags_id' }],
          },
        ],
      },
    );
  }
}
