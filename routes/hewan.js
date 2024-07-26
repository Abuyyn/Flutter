const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/authenticate');
const Hewan = require('../models/hewan');
const User = require('../models/User');  // Pastikan ini diimpor
const { formatRupiah } = require('../utils/format');

// Middleware untuk semua route pada router ini
router.use(authenticateToken);
router.use(authorizeRole(['penjual']));

// Menambahkan hewan baru
router.post('/', async (req, res) => {
    console.log('POST /hewan hit'); // Tambahkan log ini
    try {
        const { jenis, umur, harga } = req.body;
        const hewan = await Hewan.create({ jenis, umur, harga });
        res.status(201).json({
            ...hewan.toJSON(),
            harga: formatRupiah(hewan.harga)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all hewan
router.get('/', async (req, res) => {
    console.log('GET /hewan hit');
    try {
        const hewanList = await Hewan.findAll();
        console.log('Hewan list fetched successfully:', hewanList);
        res.status(200).json(hewanList.map(hewan => ({
            ...hewan.toJSON(),
            harga: formatRupiah(hewan.harga)
        })));
    } catch (error) {
        console.log('Error fetching hewan:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Get a hewan by ID
router.get('/:id', async (req, res) => {
    try {
        const hewan = await Hewan.findByPk(req.params.id);
        if (hewan) {
            res.status(200).json({
                ...hewan.toJSON(),
                harga: formatRupiah(hewan.harga)
            });
        } else {
            res.status(404).json({ message: 'Hewan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a hewan by ID
router.put('/:id', async (req, res) => {
    try {
        const { jenis, umur, harga } = req.body;
        const [updated] = await Hewan.update({ jenis, umur, harga }, {
            where: { hewanID: req.params.id }
        });
        if (updated) {
            const updatedHewan = await Hewan.findByPk(req.params.id);
            res.status(200).json({
                ...updatedHewan.toJSON(),
                harga: formatRupiah(updatedHewan.harga)
            });
        } else {
            res.status(404).json({ message: 'Hewan not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a hewan by ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Hewan.destroy({
            where: { hewanID: req.params.id }
        });

        if (deleted) {
            // Berhasil dihapus, kirimkan status 200 dengan pesan
            res.status(200).json({ message: 'Hewan berhasil dihapus' });
        } else {
            // Tidak ditemukan, kirimkan status 404 dengan pesan
            res.status(404).json({ message: 'Hewan not found' });
        }
    } catch (error) {
        // Kesalahan server, kirimkan status 500 dengan pesan kesalahan
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
