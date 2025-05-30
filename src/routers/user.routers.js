import { Router } from "express";
import UserController from "../controller/user.controller.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js"; // Named imports
import validates from "../middleware/validate.middleware.js";
import register_loginValidation from "../validation/register_login.validation.js";

const userRouter = Router()
const controller = new UserController()
userRouter
    .post("/api/post/user", authenticate, authorize('super_admin', 'admin'), validates(register_loginValidation.registerSchema), controller.addUser.bind(controller))
    .get("/api/get/all/info/:id", authenticate, authorize('super_admin', 'admin'), controller.stafInfo.bind(controller))
    .delete("/api/delete/user/:id", authenticate, authorize('super_admin', 'admin'), controller.deleteUser.bind(controller))
    .put("/api/put/user/:id", authenticate, authorize('super_admin', 'admin'), validates(register_loginValidation.registerSchema), controller.changeUser.bind(controller))

export default userRouter