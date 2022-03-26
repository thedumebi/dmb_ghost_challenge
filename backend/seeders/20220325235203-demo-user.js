"use strict";

const data = [
  {
    id: 1,
    username: "DMB",
    email: "chiwuzohdumebi@gmail.com",
    firstName: "Dumebi",
    lastName: "Chiwuzoh",
    fullName: "Dumebi Chiwuzoh",
    gender: "male",
  },
  {
    id: 2,
    username: "Mebi",
    email: "chiwuzohdaniel@gmail.com",
    firstName: "Mebi",
    lastName: "Chiwuzoh",
    fullName: "Mebi Chiwuzoh",
    gender: "female",
  },
];

module.exports = {
  /**
   * @typedef {import ("sequelize").Sequelize} Sequelize
   * @typedef {import ("sequelize").QueryInterface} QueryInterface
   */

  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Users", data);
  },

  /**
   * @typedef {import ("sequelize").Sequelize} Sequelize
   * @typedef {import ("sequelize").QueryInterface} QueryInterface
   */

  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
