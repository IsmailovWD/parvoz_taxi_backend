const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RateDriver', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'driver',
        key: 'id'
      }
    },
    rate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rate',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'rate_driver',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "driver_id",
        using: "BTREE",
        fields: [
          { name: "driver_id" },
        ]
      },
      {
        name: "rate_id",
        using: "BTREE",
        fields: [
          { name: "rate_id" },
        ]
      },
    ]
  });
};
