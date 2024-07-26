const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { authenticateToken, authorizeRole } = require('../middleware/authenticate');

// Register
router.post('/register', async (req, res) => {
    const { nama, username, password, role, alamat, nomorHp } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            nama,
            username,
            password: hashedPassword,
            role,
            alamat,
            nomorHp
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  // Token expires in 1 hour
        );
        console.log('Token generated:', token); // Tambahkan log ini
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
