const { DataTypes } = require('sequelize');
const sequelize = require('../db/config');

// eslint-disable-next-line no-unused-vars
const Data = sequelize.define(
    'Data',
    {
        heading: {
            type: DataTypes.STRING,
            allowNull: true
        },
        encryptdata: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        hint: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User', // 'User' refers to table name
                key: 'id' // 'id' refers to column name in fathers table
            }
        }
    },
    {
        freezeTableName: true
    }
);

const modifyDataMiddleware = (user) => {
    const userData = { ...user };
    if (userData.role) {
        userData.role = JSON.parse(userData.role);
    }
    const deleteParams = ['updatedAt', 'createdAt'];
    deleteParams.forEach((v) => {
        if (userData[v]) {
            delete userData[v];
        }
    });
    return userData;
};
const createData = async (data) => {
    try {
        const dataDB = {
            heading: data.heading,
            encryptdata: data.encryptdata,
            userId: data.userid,
            hint: data.hint
        };

        const encyData = await Data.create(dataDB);
        const encyDataDetails = encyData.toJSON();
        return modifyDataMiddleware(encyDataDetails);
    } catch (error) {
        console.log('error');
        throw new Error(error.message);
    }
};

const getAllHeaderId = async (userId) => {
    try {
        const AllData = await Data.findAll({
            attributes: ['id', 'heading'],
            where: {
                userId
            }
        });
        const retuenData = [];
        AllData.forEach((data) => {
            retuenData.push({ id: data.id, heading: data.heading });
        });
        return retuenData;
    } catch (error) {
        console.log('error');
        throw new Error(error.message);
    }
};

const findDataById = async (id, userId) => {
    try {
        const dataDetails = await Data.findByPk(id);
        if (!dataDetails) {
            return { errorMsg: 'validation error' };
        }
        if (dataDetails.userId !== userId) {
            return { errorMsg: 'invalid data error' };
        }
        const encryptData = dataDetails.toJSON();
        return modifyDataMiddleware(encryptData);
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteDataById = async (id, userId) => {
    try {
        const dataDetails = await Data.destroy({ where: { id, userId } });
        console.log('deleted data id ', dataDetails);
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateData = async (data, userId) => {
    try {
        const dataDetails = await Data.findByPk(data.id);
        if (!dataDetails) {
            return { errorMsg: 'data not available ' };
        }
        if (dataDetails.userId !== userId) {
            return { errorMsg: 'invalid data error' };
        }
        dataDetails.heading = data.heading;
        dataDetails.encryptdata = data.encryptdata;
        dataDetails.hint = data.hint;
        await dataDetails.save();
        const encryptData = dataDetails.toJSON();
        return modifyDataMiddleware(encryptData);
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createData,
    getAllHeaderId,
    findDataById,
    deleteDataById,
    updateData
};
