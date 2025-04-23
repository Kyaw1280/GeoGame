const express = require('express');
const router = express.Router();
const controller = require('../controllers/user_controllers');
const { authenticator, isAdmin } = require('./middleware/authMiddleware');

// Protect routes
router.get("/", authenticator, isAdmin, controller.index);
router.get("/:id", authenticator, controller.show);
router.put("/:id", authenticator, controller.update);
router.delete("/:id", authenticator, controller.destroy);

module.exports = router;


