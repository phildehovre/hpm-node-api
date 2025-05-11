const { Router } = require('express')
const analyseRoutes = require('./analyseRoutes.js')
const router = Router()
const multer = require('multer')

const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage to avoid saving files

router.use('/analyse',upload.single("videos"), analyseRoutes) 

module.exports= router;