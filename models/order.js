const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Order', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    created_date: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    whence: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    whereto: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    whence_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    whereto_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    summa: {
      type: DataTypes.DECIMAL(17,3),
      allowNull: true
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'client',
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
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order_status',
        key: 'id'
      }
    },
    closing_date: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'driver',
        key: 'id'
      }
    },
    comment: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'order',
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
        name: "client_id",
        using: "BTREE",
        fields: [
          { name: "client_id" },
        ]
      },
      {
        name: "rate_id",
        using: "BTREE",
        fields: [
          { name: "rate_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "status_id",
        using: "BTREE",
        fields: [
          { name: "status_id" },
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
