// routes/pesanan.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/authenticate');
const Pesanan = require('../models/pesanan');
const Hewan = require('../models/hewan');
const Pembeli = require('../models/pembeli');
const User = require('../models/User');
const { formatRupiah } = require('../utils/format');

// Middleware untuk semua route pada router ini
router.use(authenticateToken);
router.use(authorizeRole(['pembeli', 'penjual']));

// Membuat entri pesanan baru
router.post('/', async (req, res) => {
    try {
        const { tanggal, hewanID, pembeliID, jumlah } = req.body;

        // Validasi data yang diterima
        if (!tanggal || !hewanID || !pembeliID || !jumlah) {
            return res.status(400).json({ error: 'Data tidak lengkap' });
        }

        // Cari hewan berdasarkan hewanID
        const hewan = await Hewan.findByPk(hewanID);
        if (!hewan) {
            return res.status(400).json({ error: 'Hewan not found' });
        }

        // Verifikasi pembeli
        const pembeli = await Pembeli.findByPk(pembeliID);
        if (!pembeli) {
            return res.status(400).json({ error: 'Pembeli not found' });
        }

        // Buat pesanan
        const pesanan = await Pesanan.create({
            tanggal,
            hewanID,
            pembeliID,
            jumlah,
            total: hewan.harga * jumlah
        });

        res.status(201).json(pesanan);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Mengambil semua entri pesanan
router.get('/', async (req, res) => {
    try {
        const pesananList = await Pesanan.findAll({
            include: [
                { model: Hewan, attributes: ['jenis', 'harga'] },
                { model: Pembeli, attributes: ['nama'] }
            ]
        });
        res.status(200).json(pesananList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mengambil entri pesanan berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const pesanan = await Pesanan.findByPk(req.params.id, {
            include: [
                { model: Hewan, attributes: ['jenis', 'harga'] },
                { model: Pembeli, attributes: ['nama'] }
            ]
        });
        if (pesanan) {
            res.status(200).json(pesanan);
        } else {
            res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Memperbarui entri pesanan berdasarkan ID
router.put('/:id', async (req, res) => {
    try {
        const { tanggal, hewanID, pembeliID, jumlah } = req.body;
        const hewan = await Hewan.findByPk(hewanID);
        if (!hewan) {
            return res.status(400).json({ error: 'Hewan not found' });
        }

        const total = hewan.harga * jumlah;
        const [updated] = await Pesanan.update({ tanggal, hewanID, pembeliID, jumlah, total }, {
            where: { pesananID: req.params.id }
        });
        if (updated) {
            const updatedPesanan = await Pesanan.findByPk(req.params.id);
            res.status(200).json(updatedPesanan);
        } else {
            res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Menghapus entri pesanan berdasarkan ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Pesanan.destroy({
            where: { pesananID: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
