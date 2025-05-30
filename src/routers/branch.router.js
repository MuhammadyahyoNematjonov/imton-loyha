import { Router } from "express";
import BranchController from "../controller/branch.controller.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js"; // Named imports
// import validates from "../middleware/validate.middleware.js";

const branchRouter = Router()
const controller = new BranchController()
branchRouter
    .post("/api/post/branch", authenticate, authorize('super_admin', 'admin'), controller.addBranch.bind(controller))
    .put("/api/put/branch/:id", authenticate, authorize('super_admin', 'admin'), controller.changeBranch.bind(controller))
    .delete("/api/delete/branch/:id", authenticate, authorize('super_admin', 'admin'), controller.deleteBranch.bind(controller))
    .get("/api/get/all/branch", authenticate, authorize('super_admin', 'admin'), controller.getBranches.bind(controller))
    .get("/api/get/statistica/branch/:id", authenticate, authorize('super_admin', 'admin'), controller.branchStatistica.bind(controller))

export default branchRouter