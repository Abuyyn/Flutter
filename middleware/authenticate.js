const jwt = require('jsonwebtoken');

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
};

module.exports = { authenticateToken, authorizeRole };
