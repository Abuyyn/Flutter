const express = require('express');
const router = express.Router();
const DataPenjualan = require('../models/datapenjualan');
const Hewan = require('../models/hewan');

// Mengambil semua entri DataPenjualan
router.get('/', async (req, res) => {
    try {
        const dataPenjualanList = await DataPenjualan.findAll({
            include: [Hewan]
        });
        res.status(200).json(dataPenjualanList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mengambil entri DataPenjualan berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const dataPenjualan = await DataPenjualan.findByPk(req.params.id, {
            include: [Hewan]
        });
        if (dataPenjualan) {
            res.status(200).json(dataPenjualan);
        } else {
            res.status(404).json({ message: 'DataPenjualan tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Menghapus entri DataPenjualan berdasarkan ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await DataPenjualan.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            // Berhasil dihapus, kirimkan status 200 dengan pesan
            res.status(200).json({ message: 'DataPenjualan berhasil dihapus' });
        } else {
            // Tidak ditemukan, kirimkan status 404 dengan pesan
            res.status(404).json({ message: 'DataPenjualan tidak ditemukan' });
        }
    } catch (error) {
        // Kesalahan server, kirimkan status 500 dengan pesan kesalahan
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
