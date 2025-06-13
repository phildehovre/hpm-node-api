const { Router } = require("express");
const router = Router();
const analyseControllers = require("../controllers/analyseControllers.js");
const { requireAuth } = require("../middleware/authMiddleware.js");

router.post("", requireAuth, analyseControllers.analyseVideo);

module.exports = router;
