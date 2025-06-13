const { Router } = require("express");
const analyseRoutes = require("./analyseRoutes.js");
const testRoutes = require("./testRoutes.js");
const router = Router();
const multer = require("multer");
const { requireAuth } = require("../middleware/authMiddleware.js");

const upload = multer({ storage: multer.memoryStorage() });

router.use("/analyse", upload.array("videos"), analyseRoutes);
router.use("/test", testRoutes);

module.exports = router;
