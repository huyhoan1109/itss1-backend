'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Teacher.belongsTo(models.User, {
        foreignKey: 'teacherID',
        onUpdate: 'CASCADE', // optional
        onDelete: 'CASCADE',
      });
    }
  }
  Teacher.init({
    teacherID: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "male"
    },
    price: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    info_link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Teacher',
  });
  return Teacher;
};