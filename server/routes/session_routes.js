const {Router} = require ("express")
const sessionController = require("../controllers/session_controllers")

const sessionRouter = Router()

sessionRouter.get("/", sessionController.index)
sessionRouter.get("/:id", sessionController.show)
sessionRouter.post("/", sessionController.create)
sessionRouter.delete("/:id", sessionController.destroy)

module.exports = sessionRouter;


