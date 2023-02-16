const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AgentRegister', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    datetime: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'agent',
        key: 'id'
      }
    },
    summa: {
      type: DataTypes.FLOAT(11,2),
      allowNull: false,
      defaultValue: 0.00
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'agent_register',
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
        name: "agent_id",
        using: "BTREE",
        fields: [
          { name: "agent_id" },
        ]
      },
    ]
  });
};
