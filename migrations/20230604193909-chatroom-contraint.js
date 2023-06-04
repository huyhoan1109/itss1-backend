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

    await queryInterface.addConstraint('ChatRooms', {
      fields: ['teacherID', 'studentID'],
      type: 'unique',
      name: 'teacher_student_unique_association',
    })

    await queryInterface.addConstraint('ChatRooms', {
      fields: ['studentID'],
      type: 'foreign key',
      name: 'student_chatroom_association',
      references: {
        table: 'Users',
        field: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    })
    
    await queryInterface.addConstraint('ChatRooms', {
      fields: ['teacherID'],
      type: 'foreign key',
      name: 'teacher_chatroom_association',
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
