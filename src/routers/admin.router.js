import { Router } from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js"; // Named imports
import validates from "../middleware/validate.middleware.js";
import register_loginValidation from "../validation/register_login.validation.js";
import AdminController from "../controller/admin.controller.js";

const adminRouter = Router()
const controller = new AdminController()
adminRouter
    .post("/api/post/admin", authenticate, authorize('super_admin'), validates(register_loginValidation.registerSchema), controller.addAdmin.bind(controller))
    .get("/api/get/role/admin", authenticate, authorize('super_admin'), controller.adminsRole.bind(controller))
    .get("/api/get/username/admin", authenticate, authorize('super_admin'), controller.adminsUsername.bind(controller))
    .get("/api/get/info/admin", authenticate, authorize('super_admin'), controller.adminInfo.bind(controller))
    .delete("/api/delete/admin/:id", authenticate, authorize('super_admin'), controller.deleteAdmin.bind(controller))

export default adminRouter