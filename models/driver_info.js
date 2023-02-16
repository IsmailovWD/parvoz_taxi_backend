const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DriverInfo', {
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
    img_car_front: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    img_car_back: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    img_car_left: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    img_car_right: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tex_passport_front: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tex_passport_back: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    talon_front: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    talon_back: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'driver_info',
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
    ]
  });
};
