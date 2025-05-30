import AdminPermission from "../models/AdminPermission.js";
import User from "../models/User.js";
import CustomError from "../utils/CustomError.js";

class AdminPermissionService {
    constructor() { }

    async addAdminPermission(payload) {
        const newPermission = new AdminPermission(payload);
        const result = await newPermission.save();
        return {
            status: 201,
            success: true,
            data: result
        };
    }

    async deleteAdminPermission(userId) {
        const findUser = await User.findById(userId);
        if (!findUser) throw new CustomError("user not found", 404);

        await AdminPermission.deleteMany({ user_id: userId });

        return {
            status: 200,
            success: true,
            message: "successfully deleted"
        };
    }

    async updateAdminPermission(payload, userId) {
        const findUser = await User.findById(userId);
        if (!findUser) throw new CustomError("user not found", 404);

        const result = await AdminPermission.findOneAndUpdate(
            { user_id: userId },
            payload,
            { new: true, upsert: true }
        );

        return {
            status: 200,
            success: true,
            data: result
        };
    }

    async getAllAdminPermission() {
        const result = await AdminPermission.find().populate('user_id', 'username');

        return {
            status: 200,
            success: true,
            data: result
        };
    }
}

export default AdminPermissionService;
