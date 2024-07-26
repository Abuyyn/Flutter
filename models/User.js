const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Penjual = require('./penjual');
const Pembeli = require('./pembeli');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('penjual', 'pembeli'),
        allowNull: false
    },
    alamat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nomorHp: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: false,
    hooks: {
        afterCreate: async (user, options) => {
            if (user.role === 'penjual') {
                await Penjual.create({
                    userID: user.id,
                    nama: user.nama,
                    noTelepon: user.nomorHp,
                    alamat: user.alamat
                });
            } else if (user.role === 'pembeli') {
                await Pembeli.create({
                    userID: user.id,
                    nama: user.nama,
                    alamat: user.alamat
                });
            }
        }
    }
});

module.exports = User;
