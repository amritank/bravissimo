const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/');

class User extends Model {}

User.init( 
 {
   
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }, 
      profile_img: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
  {
    sequelize,
    hooks: {
      beforeCreate: (userObj) => {
        userObj.password = bcrypt.hashSync(userObj.password, 5);
        return userObj;
      },
    },
  }
);

module.exports = User;
