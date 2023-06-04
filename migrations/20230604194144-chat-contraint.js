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
    await queryInterface.addConstraint('Chats', {
      fields: ['userID'],
      type: 'foreign key',
      name: 'user_chat_association',
      references: {
        table: 'Users',
        field: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    })
    
    await queryInterface.addConstraint('Chats', {
      fields: ['chatroomID'],
      type: 'foreign key',
      name: 'chatroom_chat_association',
      references: {
        table: 'ChatRooms',
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
  }
};