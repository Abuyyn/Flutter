const { DataTypes } = require('sequelize');
const sequelize = require('./index'); 
const Hewan = require('./hewan');

const DataPenjualan = sequelize.define('DataPenjualan', {
    dataPenjualanID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    hewanID: {
        type: DataTypes.INTEGER,
        references: {
            model: Hewan,
            key: 'hewanID'
        }
    },
    nama_hewan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    harga: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }
}, {
    tableName: 'datapenjualan',
    timestamps: false
});

module.exports = DataPenjualan;
