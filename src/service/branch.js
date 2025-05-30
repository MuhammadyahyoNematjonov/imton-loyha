import Branch from "../models/Branch.js";
import User from "../models/User.js";
import Transport from "../models/Transport.js";
import AdminPermission from "../models/AdminPermission.js";
import CustomError from "../utils/CustomError.js";

class BranchService {
    constructor() { }

    async addBranch(payload, user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const findPermissionUser = await AdminPermission.findOne({ user_id });
        if (!findPermissionUser || !findPermissionUser.can_create || !findPermissionUser.can_control_branch) {
            throw new CustomError("no allowed create permission", 401);
        }

        const newBranch = new Branch(payload);
        const result = await newBranch.save();

        return {
            status: 201,
            success: true,
            data: result
        };
    }

    async changeBranch(payload, branch_id, user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const findPermissionUser = await AdminPermission.findOne({ user_id });
        if (!findPermissionUser || !findPermissionUser.can_update || !findPermissionUser.can_control_branch) {
            throw new CustomError("no allowed update permission", 401);
        }

        const result = await Branch.findByIdAndUpdate(branch_id, payload, { new: true });
        if (!result) {
            throw new CustomError("branch not found", 404);
        }

        return {
            status: 200,
            success: true,
            data: result
        };
    }

    async deleteBranch(branch_id, user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const findPermissionUser = await AdminPermission.findOne({ user_id });
        if (!findPermissionUser || !findPermissionUser.can_delete || !findPermissionUser.can_control_branch) {
            throw new CustomError("no allowed delete permission", 401);
        }

        const findBranch = await Branch.findById(branch_id);
        if (!findBranch) {
            throw new CustomError("branch not found", 404);
        }

        // Delete related data
        await Transport.deleteMany({ branch_id });
        await User.deleteMany({ branch_id });
        const result = await Branch.findByIdAndDelete(branch_id);

        if (!result) throw new CustomError("already deleted", 404);

        return {
            status: 200,
            success: true,
            message: "successfully deleted"
        };
    }

    async getBranches(user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const findPermissionUser = await AdminPermission.findOne({ user_id });
        if (!findPermissionUser || !findPermissionUser.can_read || !findPermissionUser.can_control_branch) {
            throw new CustomError("no allowed read permission", 401);
        }

        const result = await Branch.find();

        return {
            status: 200,
            success: true,
            data: result
        };
    }

    async branchStatistica(branch_id, user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const findPermissionUser = await AdminPermission.findOne({ user_id });
        if (!findPermissionUser || !findPermissionUser.can_read || !findPermissionUser.can_control_branch) {
            throw new CustomError("no allowed read permission", 401);
        }

        const branch = await Branch.findById(branch_id);
        if (!branch) throw new CustomError("branch not found", 404);

        const users = await User.find({ branch_id }).select('-password');
        const transports = await Transport.find({ branch_id });

        return {
            status: 200,
            success: true,
            data: {
                branch,
                users,
                transports
            }
        };
    }
}

export default BranchService;