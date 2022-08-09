import * as Sequelize from 'sequelize';
import { DataTypes, Model } from 'sequelize';

export interface SeederMetaAttributes {
  name: string;
}

export type SeederMetaPk = 'name';
export type SeederMetaId = SeederMeta[SeederMetaPk];
export type SeederMetaCreationAttributes = SeederMetaAttributes;

export class SeederMeta extends Model<SeederMetaAttributes, SeederMetaCreationAttributes> implements SeederMetaAttributes {
  name!: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof SeederMeta {
    return SeederMeta.init(
      {
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'SeederMeta',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'SeederMeta_pkey',
            unique: true,
            fields: [{ name: 'name' }],
          },
        ],
      },
    );
  }
}
