import { Router } from "express";
import TransportController from "../controller/transports.controller.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js"; // Named imports
import validates from "../middleware/validate.middleware.js";
import transportSchema from "../validation/transport.validation.js";

const transportRouter = Router()
const controller = new TransportController()

transportRouter
    .get("/api/get/transport/branch/:branch_id", authenticate, authorize('super_admin', 'admin'), controller.getTransport.bind(controller))
    .get("/api/get/transport/model/:model", authenticate, authorize('super_admin', 'admin'), controller.getModel.bind(controller))
    .post("/api/post/transport", authenticate, authorize('super_admin', 'admin'), validates(transportSchema), controller.addTransport.bind(controller))
    .put("/api/put/transport/:id", authenticate, authorize('super_admin', 'admin'), validates(transportSchema), controller.changeTransport.bind(controller))
    .delete("/api/delete/transport/:id", authenticate, authorize('super_admin', 'admin'), controller.deleteTransport.bind(controller))

export default transportRouter