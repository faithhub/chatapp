const Sequelize = require('sequelize');
const database = require('../config/Connection');

const Users = database.define('chatappusers', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: Sequelize.UUIDV4,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
    },
    mobile: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Username already exist'
        }
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false
    },
    countryCode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Username already exist'
        }
    },
    fullName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dob: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Users;