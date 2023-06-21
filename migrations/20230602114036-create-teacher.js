'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Teachers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      teacherID: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      experience: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      info_link: {
        type: Sequelize.STRING,
        allowNull: false
      },
      star_average: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      certificate1: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      certificate2: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      certificate3: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      teach_method1: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      teach_method2: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      teach_method3: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      detail: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Teachers');
  }
};