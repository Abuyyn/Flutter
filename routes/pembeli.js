const express = require('express');
const router = express.Router();
const Pembeli = require('../models/pembeli'); const { authenticateToken, authorizeRole } = require('../middleware/authenticate');

// Middleware jika diperlukan
 router.use(authenticateToken);
 router.use(authorizeRole(['penjual'])); // Contoh jika hanya admin yang bisa mengakses route ini

// Mengambil semua entri pembeli
router.get('/', async (req, res) => {
    try {
        const pembeliList = await Pembeli.findAll();
        res.status(200).json(pembeliList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mengambil entri pembeli berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const pembeli = await Pembeli.findByPk(req.params.id);
        if (pembeli) {
            res.status(200).json(pembeli);
        } else {
            res.status(404).json({ message: 'Pembeli tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Menghapus entri pembeli berdasarkan ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Pembeli.destroy({
            where: { pembeliID: req.params.id }
        });

        if (deleted) {
            // Berhasil dihapus, kirimkan status 200 dengan pesan
            res.status(200).json({ message: 'Pembeli berhasil dihapus' });
        } else {
            // Tidak ditemukan, kirimkan status 404 dengan pesan
            res.status(404).json({ message: 'Pembeli tidak ditemukan' });
        }
    } catch (error) {
        // Kesalahan server, kirimkan status 500 dengan pesan kesalahan
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
