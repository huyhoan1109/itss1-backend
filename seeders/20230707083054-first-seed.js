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
        password: 'admin',
        phone: '123456789',
        role: 'admin',
        lat: '0',
        lng: '0',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ho Tuan Hung',
        email: 'hung@gmail.com',
        password: '12345678',
        phone: '123456789',
        role: 'teacher',
        lat: '21.006568',
        lng: '105.84752',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Nguyen Huy Hoan',
        email: 'hoan@gmail.com',
        password: '12345678',
        phone: '123456789',
        role: 'teacher',
        lat: '21.0065',
        lng: '105.84740',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Nguyen Thu Phuong',
        email: 'phuong@gmail.com',
        password: '12345678',
        phone: '123456789',
        role: 'teacher',
        lat: '21.0065',
        lng: '105.84740',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Phan Dac Hoa',
        email: 'hoa@gmail.com',
        password: '12345678',
        phone: '123456789',
        role: 'teacher',
        lat: '21.007',
        lng: '105.84768',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Nguyen Tien Dung',
        email: 'dung@gmail.com',
        password: '12345678',
        phone: '123456789',
        role: 'teacher',
        lat: '21.0069',
        lng: '105.84762',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Phung Ngoc Vinh',
        email: 'vinh@gmail.com',
        password: '12345678',
        phone: '123456789',
        role: 'teacher',
        lat: '21.0069',
        lng: '105.84762',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Nguyen Ngoc Tuan',
        email: 'tuan@gmail.com',
        password: '12345678',
        phone: '123456789',
        role: 'teacher',
        lat: '21.008',
        lng: '105.84692',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Phan Viet Anh',
        email: 'anh@gmail.com',
        password: '12345678',
        phone: '123456789',
        role: 'teacher',
        lat: '21.008',
        lng: '105.84692',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Le Danh Dai',
        email: 'dai@gmail.com',
        password: '12345678',
        phone: '123456789',
        role: 'teacher',
        lat: '21.0078',
        lng: '105.84698',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Le Quy Hai',
        email: 'hai@gmail.com',
        password: '12345678',
        phone: '123456789',
        role: 'teacher',
        lat: '21.00692',
        lng: '105.84688',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {
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
