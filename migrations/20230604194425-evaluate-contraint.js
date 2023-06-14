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
    await queryInterface.addConstraint('Evaluates', {
      fields: ['userID'],
      type: 'foreign key',
      name: 'student_evaluate_association',
      references: {
        table: 'Users',
        field: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    })

    await queryInterface.addConstraint('Evaluates', {
      fields: ['teacherID'],
      type: 'foreign key',
      name: 'teacher_evaluate_association',
      references: {
        table: 'Teachers',
        field: 'teacherID',
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
  }
};
