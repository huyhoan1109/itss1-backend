'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Comment, {
        foreignKey: 'userID',
        onUpdate: 'CASCADE', // optional
        onDelete: 'CASCADE',
      })
      User.hasMany(models.Comment, {
        foreignKey: 'studentID',
        onUpdate: 'CASCADE', // optional
        onDelete: 'CASCADE',
      })
      User.hasMany(models.Evaluate, {
        foreignKey: 'studentID',
        onUpdate: 'CASCADE', // optional
        onDelete: 'CASCADE',
      })
    }
    validPassword(password){
      return bcrypt.compareSync(password, this.password);
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email:{
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'student'
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Ha Noi'
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isBlock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSaltSync(10);
        user.password = await bcrypt.hashSync(user.password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')){
          const salt = await bcrypt.genSaltSync(10);
          user.password = await bcrypt.hashSync(user.password, salt);
        }
      }
    }
  });
  return User;
};