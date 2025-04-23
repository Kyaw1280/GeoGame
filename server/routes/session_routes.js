const {Router} = require ("express")
const sessionController = require("../controllers/session_controllers")
const { authenticator, isAdmin } = require("./middleware/authMiddleware");


const sessionRouter = Router()

sessionRouter.get("/", authenticator, isAdmin, sessionController.index);
sessionRouter.get("/:id", authenticator, sessionController.show);
sessionRouter.post("/", authenticator, sessionController.create);
sessionRouter.delete("/:id", authenticator, sessionController.destroy);

module.exports = sessionRouter;


