'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChatRoom.belongsTo(models.User, {
        foreignKey: 'studentID',
        onUpdate: 'CASCADE', // optional
        onDelete: 'CASCADE',
      });
      ChatRoom.hasMany(models.Teacher, {
          foreignKey: 'teacherID',
          onUpdate: 'CASCADE', // optional
          onDelete: 'CASCADE',
      })
    }
  }
  ChatRoom.init({
    teacherID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    studentID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ChatRoom',
  });
  return ChatRoom;
};