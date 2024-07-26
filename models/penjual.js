const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User'); // Import User untuk foreign key

const Penjual = sequelize.define('Penjual', {
    penjualID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userID: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'ID'
        }
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    noTelepon: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alamat: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'penjual',
    timestamps: false
});

module.exports = Penjual;
