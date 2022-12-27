const jwt = require('jsonwebtoken')

//  middleware to authenticate the login of doctor and patient
const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers['token'];
        const data = jwt.verify(token, 'user-key')
        next();
    } catch (error) {
        res.status(401).json({
            message: "please login"
        })
    }
}

module.exports = jwtMiddleware 