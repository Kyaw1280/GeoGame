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

        // Inject user info from token
        req.user = {
            id: decoded.id,
            isAdmin: decoded.isAdmin
        };

        next();
    });
}


module.exports = {
    authenticator
};