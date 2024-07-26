const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User'); // Import User untuk foreign key

const Pembeli = sequelize.define('Pembeli', {
    pembeliID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userID: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alamat: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'pembeli',
    timestamps: false
});

module.exports = Pembeli;
