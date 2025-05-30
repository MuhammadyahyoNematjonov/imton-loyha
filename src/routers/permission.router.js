import { Router } from "express";
import PermissionController from "../controller/permission.controller.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js"; // Named imports
import validates from "../middleware/validate.middleware.js";
import permissionSchema from "../validation/permission.validation.js";

const permissionRouters = Router()
const controller = new PermissionController()
permissionRouters
    .post("/api/add/permission", authenticate, authorize('super_admin', 'admin'), validates(permissionSchema), controller.addPermission.bind(controller))
    .delete("/api/delete/permision/:id", authenticate, authorize('super_admin', 'admin'), controller.deletePermission.bind(controller))
    .put("/api/update/permission/:id", authenticate, authorize('super_admin', 'admin'), validates(permissionSchema), controller.changePermission.bind(controller))
    .get("/api/get/all/permission", authenticate, authorize('super_admin', 'admin'), controller.allPermissions.bind(controller))
    .get("/api/one/permission/:id", authenticate, authorize('super_admin', 'admin'), controller.onePermission.bind(controller))

export default permissionRouters