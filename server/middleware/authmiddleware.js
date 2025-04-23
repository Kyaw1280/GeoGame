const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'dev_secret_key';


function authenticator(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Missing token' });
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        // Inject user info into request
        req.user = {
            id: decoded.id,
            isAdmin: decoded.isAdmin
        };

        next();
    });
}


function isAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    return res.status(403).json({ error: 'Forbidden: Admins only' });
}

module.exports = {
    authenticator,
    isAdmin
};