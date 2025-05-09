const jwt = require('jsonwebtoken')




const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                if (err.name == 'TokenExpiredError') {
                    const errors = {authentication: 'token is expired'}
                    res.status(403).json({errors})
                }
                const errors = {authentication: 'invalid token: '+ err}
                res.status(403).json({errors})
            } else {
                next()
            }
        })
    }
    else {
        const errors = {jwt: 'No token'}
        res.status(403).json({errors})
    }
}

module.exports = {requireAuth}