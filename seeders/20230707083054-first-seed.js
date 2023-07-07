'use strict';
require("dotenv").config()
const bcrypt = require('bcrypt')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [{
      name: 'admin',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('admin', bcrypt.genSaltSync(10)),
      phone: '123456789',
      role: 'admin',
      lat: '0',
      lng: '0',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
