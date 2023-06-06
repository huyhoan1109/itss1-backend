'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Matching extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Matching.belongsTo(models.Teacher, {
        foreignKey: 'teacherID',
        onUpdate: 'CASCADE', // optional
        onDelete: 'CASCADE',
      });
      Matching.belongsTo(models.User, {
        foreignKey: 'studentID',
        onUpdate: 'CASCADE', // optional
        onDelete: 'CASCADE',
      });
    }
  }
  Matching.init({
    teacherID: DataTypes.INTEGER,
    studentID: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    info: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Matching',
  });
  return Matching;
};