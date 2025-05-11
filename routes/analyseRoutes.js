const {Router} = require('express')
const router = Router()
const analyseControllers = require('../controllers/analyseControllers.js')

// router.post('', analyseControllers.analyse)
router.post('', analyseControllers.analyseVideo)

module.exports = router;