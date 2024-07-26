const jwt = require('jsonwebtoken');
require("dotenv").config()

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        console.log('No token provided');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.sendStatus(403);
        }
        req.user = user;
        console.log('Token verified, user:', user);
        next();
    });
};

const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.log(`Role ${req.user.role} not authorized`);
            return res.status(403).json({ error: 'Forbidden' });
        }
        console.log(`Role ${req.user.role} authorized`);
        next();
    };
}; //Kode yang menunjukkan pembatasan hak akses terhadap sumber daya data tertentu adalah middleware authorizeRole. 
//Middleware ini berfungsi untuk membatasi akses ke rute tertentu berdasarkan peran pengguna. Prosesnya dimulai dengan 
//memeriksa peran pengguna yang tersimpan di dalam objek req.user setelah token JWT diverifikasi oleh middleware authenticateToken.
// Middleware authorizeRole menerima parameter berupa array roles, yang berisi daftar peran yang diizinkan untuk mengakses rute tersebut. 
//Middleware ini kemudian memeriksa apakah peran pengguna (req.user.role) termasuk dalam array roles. Jika peran pengguna tidak ada dalam daftar peran yang diizinkan, 
//middleware akan mengembalikan status 403 Forbidden dan mencetak pesan ke konsol bahwa peran pengguna tidak diotorisasi. Sebaliknya, jika peran pengguna sesuai dengan peran yang diizinkan,
// middleware akan melanjutkan proses ke rute berikutnya dengan memanggil next(). Dengan demikian, authorizeRole efektif dalam memastikan bahwa hanya pengguna dengan peran yang sesuai yang dapat mengakses rute atau sumber daya yang dilindungi.

module.exports = { authenticateToken, authorizeRole };
