import { Router } from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js"; // Named imports
import AdminPermissionController from "../controller/adminPermission.controller.js";
import validates from "../middleware/validate.middleware.js";
import adminPermissionSchema from "../validation/admin.permission.validation.js";

const adminPermissionRouter = Router()
const controller = new AdminPermissionController()
adminPermissionRouter
    .post("/api/post/admin/permission", authenticate, authorize('super_admin'), validates(adminPermissionSchema), controller.addPermission.bind(controller))
    .delete("/api/delete/admin/permission/:id", authenticate, authorize('super_admin'), controller.deleteAdminPermission.bind(controller))
    .put("/api/put/admin/permission/:id", authenticate, authorize('super_admin'), validates(adminPermissionSchema), controller.updateAdminPermission.bind(controller))
    .get("/api/get/admin/permission", authenticate, authorize('super_admin'), controller.getAllAdminPermission.bind(controller))

export default adminPermissionRouter