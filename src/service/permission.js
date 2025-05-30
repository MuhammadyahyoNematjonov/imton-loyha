import Permission from "../models/Permission.js";
import User from "../models/User.js";
import AdminPermission from "../models/AdminPermission.js";
import CustomError from "../utils/CustomError.js";

class PermissionService {
    constructor() { }

    async addPermission(payload, userId) {
        const findUser = await User.findById(userId);
        if (!findUser) throw new CustomError("user not found", 404);

        const checkadmin = await AdminPermission.findOne({ user_id: userId });
        if (!checkadmin || !checkadmin.can_add_permission) {
            throw new CustomError("No allowed addpermission", 401);
        }

        const newPermission = new Permission(payload);
        const result = await newPermission.save();

        return {
            status: 201,
            success: true,
            data: result
        };
    }

    async deletePermission(permissionId, user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const checkadminPermission = await AdminPermission.findOne({ user_id });
        if (!checkadminPermission || !checkadminPermission.can_delete) {
            throw new CustomError("No allowed delete permission", 401);
        }

        const result = await Permission.findByIdAndDelete(permissionId);
        if (!result) throw new CustomError("permission not found", 404);

        return {
            status: 200,
            success: true,
            message: "successfully deleted"
        };
    }

    async changePermission(payload, permissionId, user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const checkadminPermission = await AdminPermission.findOne({ user_id });
        if (!checkadminPermission || !checkadminPermission.can_update) {
            throw new CustomError("No allowed update permission", 401);
        }

        const result = await Permission.findByIdAndUpdate(permissionId, payload, { new: true });
        if (!result) throw new CustomError("permission not found", 404);

        return {
            status: 200,
            success: true,
            data: result
        };
    }

    async allPermissions(user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("user not found", 404);

        const permisionUser = await AdminPermission.findOne({ user_id });
        if (!permisionUser || !permisionUser.can_read) {
            throw new CustomError("No allowed read permission", 401);
        }

        const result = await Permission.find()
            .populate('user_id', 'username')
            .populate('transport_id', 'model color');

        return {
            status: 200,
            success: true,
            data: result
        };
    }

    async onePermission(userId, user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("user not found", 404);

        const permisionUser = await AdminPermission.findOne({ user_id: userId });
        if (!permisionUser || !permisionUser.can_read) {
            throw new CustomError("No allowed read permission", 401);
        }

        const result = await Permission.findOne({ user_id: userId })
            .populate('user_id', 'username')
            .populate('transport_id', 'model color');
        
        if (!result) throw new CustomError("user's permission not found", 404);

        return {
            status: 200,
            success: true,
            data: result
        };
    }
}

export default PermissionService;
