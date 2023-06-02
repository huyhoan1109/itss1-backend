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

    await queryInterface.addConstraint('Matchings', {
      fields: ['studentID'],
      type: 'foreign key',
      name: 'student_match_association',
      references: {
        table: 'Users',
        field: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    })

    await queryInterface.addConstraint('Matchings', {
      fields: ['teacherID'],
      type: 'foreign key',
      name: 'teacher_match_association',
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

    // queryInterface.removeConstraint('Matchings', {
    //   fields: ['teacherID'],
    //   type: ['foreign key'],
    //   name: 'teacher_match_association',
    //   references: {
    //     table: 'Teachers',
    //     field: 'teacherID',
    //     // onUpdate: 'CASCADE',
    //     // onDelete: 'CASCADE'
    //   }
    // })

    // queryInterface.removeConstraint('Matchings', {
    //   fields: ['studentID'],
    //   type: ['foreign key'],
    //   name: 'student_match_association',
    //   references: {
    //     table: 'Users',
    //     field: 'id',
    //     // onUpdate: 'CASCADE',
    //     // onDelete: 'CASCADE'
    //   }
    // })
  }
};
