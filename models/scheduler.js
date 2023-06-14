'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Scheduler extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Scheduler.belongsTo(models.Teacher, {
        foreignKey: 'teacherID',
        onUpdate: 'CASCADE', // optional
        onDelete: 'CASCADE',
      })
    }
  }
  Scheduler.init({
    teacherID: DataTypes.INTEGER,
    weekdayID: DataTypes.INTEGER,
    shiftID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Scheduler',
  });
  return Scheduler;
};