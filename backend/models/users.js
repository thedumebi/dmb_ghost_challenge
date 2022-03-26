/**
 * @typedef {import ("sequelize").Sequelize} Sequelize
 * @typedef {import ("sequelize").DataTypes} DataTypes
 *
 */
const { DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      fullName: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "Users",
      timestamps: false,
      hooks: {
        beforeSave: (user, options) => {
          user.fullName = [user.firstName, user.lastName].join(" ");
        },
        beforeUpdate: (user, options) => {
          user.fullName = [user.firstName, user.lastName].join(" ");
        },
      },
    }
  );

  Users.associate = function (models) {
    Users.hasMany(models.Comments, {
      foreignKey: "author_id",
      as: "comments",
    });

    Users.belongsToMany(models.Comments, {
      through: "LikedComments",
      as: "likedComments",
    });
  };

  return Users;
};
