const { Router } = require("express");
const analyseRoutes = require("./analyseRoutes.js");
const router = Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.use("/analyse", upload.array("videos"), analyseRoutes);

module.exports = router;
