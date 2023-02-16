const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CompletedOrder', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order',
        key: 'id'
      }
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'driver',
        key: 'id'
      }
    },
    summa: {
      type: DataTypes.DECIMAL(17,3),
      allowNull: false
    },
    km_out_city: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    km: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    wait_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    datetime: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    firma_summa: {
      type: DataTypes.DOUBLE(11,2),
      allowNull: false,
      defaultValue: 0.00
    },
    agent_summa: {
      type: DataTypes.DOUBLE(11,2),
      allowNull: false,
      defaultValue: 0.00
    }
  }, {
    sequelize,
    tableName: 'completed_order',
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
        name: "order_id",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "driver_id",
        using: "BTREE",
        fields: [
          { name: "driver_id" },
        ]
      },
    ]
  });
};
