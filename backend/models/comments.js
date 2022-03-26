const moment = require("moment");

/**
 * @typedef {import ("sequelize").Sequelize} Sequelize
 * @typedef {import ("sequelize").DataTypes} DataTypes
 *
 */

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */

module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define(
    "Comments",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      time: {
        type: DataTypes.BIGINT(11),
        defaultValue: moment().unix(),
      },
    },
    {
      sequelize,
      tableName: "Comments",
      timestamps: false,
    }
  );

  Comments.associate = function (models) {
    Comments.belongsTo(models.Users, {
      foreignKey: "author_id",
      targetKey: "id",
      as: "author",
      onDelete: "SET NULL",
    });

    Comments.belongsToMany(models.Users, {
      through: "LikedComments",
      as: "likes",
    });

    Comments.hasMany(models.Comments, {
      foreignKey: "parent_id",
      as: "replies",
    });

    Comments.belongsTo(models.Comments, {
      foreignKey: "parent_id",
      targetKey: "id",
      as: "parent",
      onDelete: "SET NULL",
    });
  };

  return Comments;
};
