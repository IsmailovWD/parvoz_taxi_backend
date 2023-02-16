const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    firstname: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "phone_number"
    },
    password: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('Admin','operator','dasturchi','agent'),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    paranoid: true,
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
        name: "phone_number",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "phone_number" },
        ]
      },
    ]
  });
};
