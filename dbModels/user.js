const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');
const Sha512Encryption = require('../helpers/sha256');

const User = sequelize.define(
    'User',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        freezeTableName: true
    }
);

const modifyUserDataMiddleware = (user) => {
    const userData = { ...user };
    if (userData.role) {
        userData.role = JSON.parse(userData.role);
    }
    const deleteParams = ['password', 'updatedAt', 'createdAt'];
    deleteParams.forEach((v) => {
        if (userData[v]) {
            delete userData[v];
        }
    });
    return userData;
};

const createUserByPassword = async (userInput) => {
    try {
        const user = {
            name: userInput.name,
            email: userInput.email,
            password: userInput.password
        };
        let userDetails = await User.findOne({ where: { email: user.email } });
        if (userDetails) {
            return { errorMsg: 'User already exists' };
        }

        user.password = Sha512Encryption(
            user.password,
            process.env.PASSWORD_ENCRYPTION,
            process.env.PASSWORD_ENCRYPTION_ROUND
        );

        userDetails = await User.create(user);
        const userData = userDetails.toJSON();
        return modifyUserDataMiddleware(userData);
    } catch (error) {
        console.log('error');
        throw new Error(error.message);
    }
};

const findUserById = async (id) => {
    try {
        const userDetails = await User.findByPk(id);
        if (!userDetails) {
            return { errorMsg: 'validation error' };
        }
        const userData = userDetails.toJSON();
        return modifyUserDataMiddleware(userData);
    } catch (error) {
        throw new Error(error.message);
    }
};

const checkUserEmailPass = async (userInput) => {
    try {
        const userDetails = await User.findOne({ where: { email: userInput.email } });
        if (!userDetails) {
            return { errorMsg: 'User not exists' };
        }
        const userInputPassHash = Sha512Encryption(
            userInput.password,
            process.env.PASSWORD_ENCRYPTION,
            process.env.PASSWORD_ENCRYPTION_ROUND
        );
        if (userDetails.password === userInputPassHash) {
            const userData = userDetails.toJSON();
            return modifyUserDataMiddleware(userData);
        }
        return { errorMsg: 'email or password not matched' };
    } catch (error) {
        console.log('error');
        throw new Error(error.message);
    }
};

module.exports = {
    createUserByPassword,
    findUserById,
    checkUserEmailPass
};
