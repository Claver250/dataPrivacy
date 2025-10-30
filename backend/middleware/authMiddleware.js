const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.'});
    };

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }catch(err){
        res.status(400).json({ error: 'Invalid or expired token'})
    }
};

module.exports = authenticate;