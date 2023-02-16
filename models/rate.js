const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Rate', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    min_summa: {
      type: DataTypes.DECIMAL(17,3),
      allowNull: false
    },
    min_km: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    wait_price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    free_wait_time: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    out_price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    city_price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    profit: {
      type: DataTypes.DOUBLE(11,2),
      allowNull: false,
      defaultValue: 0.00
    }
  }, {
    sequelize,
    tableName: 'rate',
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
    ]
  });
};
