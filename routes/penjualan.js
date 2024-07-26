const express = require('express');
const router = express.Router();
const Penjualan = require('../models/penjualan');
const Hewan = require('../models/hewan');
const User = require('../models/User');
const { formatRupiah } = require('../utils/format');

// Membuat entri penjualan baru
router.post('/', async (req, res) => {
    try {
        const { tanggal, total, hewanID, penjualID, jumlah } = req.body;

        // Memeriksa keberadaan hewan dan penjual
        const hewan = await Hewan.findByPk(hewanID);
        const penjual = await User.findByPk(penjualID);

        if (!hewan || !penjual) {
            return res.status(400).json({ message: 'Hewan atau Penjual tidak ditemukan' });
        }

        const newPenjualan = await Penjualan.create({ tanggal, total, hewanID, penjualID, jumlah });
        
        res.status(201).json({
            ...newPenjualan.toJSON(),
            total: formatRupiah(total),
            Hewan: {
                ...hewan.toJSON(),
                harga: formatRupiah(hewan.harga)
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Mengambil semua entri penjualan
router.get('/', async (req, res) => {
    try {
        const penjualanList = await Penjualan.findAll({
            attributes: ['penjualanID', 'tanggal', 'total', 'hewanID', 'penjualID', 'jumlah'],
            include: [
                {
                    model: Hewan,
                    attributes: ['hewanID', 'jenis', 'umur', 'harga']
                }
            ]
        });
        res.status(200).json(penjualanList.map(penjualan => ({
            ...penjualan.toJSON(),
            total: formatRupiah(penjualan.total),
            Hewan: {
                ...penjualan.Hewan.toJSON(),
                harga: formatRupiah(penjualan.Hewan.harga)
            }
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mengambil entri penjualan berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const penjualan = await Penjualan.findByPk(req.params.id, {
            attributes: ['penjualanID', 'tanggal', 'total', 'hewanID', 'penjualID', 'jumlah'],
            include: [
                {
                    model: Hewan,
                    attributes: ['hewanID', 'jenis', 'umur', 'harga']
                }
            ]
        });
        if (penjualan) {
            res.status(200).json({
                ...penjualan.toJSON(),
                total: formatRupiah(penjualan.total),
                Hewan: {
                    ...penjualan.Hewan.toJSON(),
                    harga: formatRupiah(penjualan.Hewan.harga)
                }
            });
        } else {
            res.status(404).json({ message: 'Penjualan tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Memperbarui entri penjualan berdasarkan ID
router.put('/:id', async (req, res) => {
    try {
        const { tanggal, total, hewanID, penjualID, jumlah } = req.body;
        const [updated] = await Penjualan.update({ tanggal, total, hewanID, penjualID, jumlah }, {
            where: { penjualanID: req.params.id }
        });
        if (updated) {
            const updatedPenjualan = await Penjualan.findByPk(req.params.id, {
                include: [{ model: Hewan, attributes: ['harga'] }]
            });
            res.status(200).json({
                ...updatedPenjualan.toJSON(),
                total: formatRupiah(updatedPenjualan.total),
                Hewan: {
                    ...updatedPenjualan.Hewan.toJSON(),
                    harga: formatRupiah(updatedPenjualan.Hewan.harga)
                }
            });
        } else {
            res.status(404).json({ message: 'Penjualan tidak ditemukan' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Menghapus entri penjualan berdasarkan ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Penjualan.destroy({
            where: { penjualanID: req.params.id }
        });

        if (deleted) {
            // Berhasil dihapus, kirimkan status 200 dengan pesan
            res.status(200).json({ message: 'Penjualan berhasil dihapus' });
        } else {
            // Tidak ditemukan, kirimkan status 404 dengan pesan
            res.status(404).json({ message: 'Penjualan tidak ditemukan' });
        }
    } catch (error) {
        // Kesalahan server, kirimkan status 500 dengan pesan kesalahan
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
