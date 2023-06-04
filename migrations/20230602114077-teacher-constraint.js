'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint('Teachers', {
      fields: ['teacherID'],
      type: 'foreign key',
      name: 'teacher_user_association',
      references: {
        table: 'Users',
        field: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // queryInterface.removeConstraint('Teachers', {
    //   fields: ['teacherID'],
    //   type: 'foreign key',
    //   name: 'teacher_user_association',
    //   references: {
    //     table: 'Users',
    //     field: 'id',
    //     onUpdate: 'CASCADE',
    //     onDelete: 'CASCADE'
    //   }
    // })
  }
};
