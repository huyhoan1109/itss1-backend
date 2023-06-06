'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, {
        foreignKey: 'studentID',
        onUpdate: 'CASCADE', // optional
        onDelete: 'CASCADE',
      });
      Comment.belongsTo(models.Teacher, {
        foreignKey: 'teacherID',
        onUpdate: 'CASCADE', // optional
        onDelete: 'CASCADE',
      });
    }
  }
  Comment.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    star: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
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
    modelName: 'Comment',
  });
  return Comment;
};