const { Router } = require("express");
const router = Router();
const testControllers = require("../controllers/testControllers.js");
const { requireAuth } = require("../middleware/authMiddleware.js");

router.get("/jwt", requireAuth, testControllers.testJWT);
router.get("/path", testControllers.testPath);

module.exports = router;
