'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Evaluate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Evaluate.belongsTo(models.Teacher, {
        foreignKey: 'teacherID',
        onUpdate: 'CASCADE', // optional
        onDelete: 'CASCADE',
      });
      Evaluate.belongsTo(models.User, {
        foreignKey: 'userID',
        onUpdate: 'CASCADE', // optional
        onDelete: 'CASCADE',
      });
    }
  }
  Evaluate.init({
    teacherID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Evaluate',
  });
  return Evaluate;
};