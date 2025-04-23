const express = require('express');
const userRouter = express.Router();
const controller = require('../controllers/user_controllers');
const { authenticator, isAdmin } = require('../middleware/authmiddleware');

// Protect routes
userRouter.get("/", authenticator, isAdmin, controller.index);
userRouter.get("/:id", authenticator, controller.show);
userRouter.put("/:id", authenticator, controller.update);
userRouter.delete("/:id", authenticator, controller.destroy);

module.exports = userRouter;


