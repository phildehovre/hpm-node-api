const { Router } = require('express')
const analyseRoutes = require('./analyseRoutes.js')
const {requireAuth} = require('../middleware/authMiddleware.js')
const router = Router()

router.use('/analyse', requireAuth, analyseRoutes) 

module.exports= router;