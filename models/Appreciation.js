const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Appreciation extends Model { }

Appreciation.init(
    {
        SenderId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ReceiverId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        sequelize
    });

module.exports = Appreciation;
