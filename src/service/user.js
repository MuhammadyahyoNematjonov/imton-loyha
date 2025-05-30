import User from "../models/User.js";
import AdminPermission from "../models/AdminPermission.js";
import Permission from "../models/Permission.js";
import Transport from "../models/Transport.js";
import Branch from "../models/Branch.js";
import CustomError from "../utils/CustomError.js";
import bcrypt from "bcrypt";

class UserService {
    constructor() { }

    async addUser(payload, user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const findPermissionUser = await AdminPermission.findOne({ user_id });
        if (!findPermissionUser?.can_create) {
            throw new CustomError("no allowed create permission", 401);
        }

        if (payload.repeat_password !== payload.password) {
            throw new CustomError("password isn't match", 401);
        }

        const hashpassword = await bcrypt.hash(payload.password, 10);
        
        const newUser = new User({
            username: payload.username,
            password: hashpassword,
            birth_date: payload.birth_date,
            gender: payload.gender,
            role: payload.role,
            branch_id: payload.branch_id
        });

        const savedUser = await newUser.save();
        const { password, ...userData } = savedUser.toObject();

        return {
            status: 201,
            success: true,
            data: userData
        };
    }

    async stafInfo(userId, user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const findPermissionUser = await AdminPermission.findOne({ user_id });
        if (!findPermissionUser?.can_read) {
            throw new CustomError("no allowed read permission", 401);
        }

        const user = await User.findById(userId)
            .select('-password')
            .populate('branch_id');

        if (!user) throw new CustomError("user not found", 404);

        const transports = await Transport.find({ branch_id: user.branch_id });

        return {
            status: 200,
            success: true,
            data: {
                ...user.toObject(),
                transports
            }
        };
    }

    async deleteUser(userId, user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const findPermissionUser = await AdminPermission.findOne({ user_id });
        if (!findPermissionUser?.can_delete) {
            throw new CustomError("no allowed delete permission", 401);
        }

        await Permission.deleteMany({ user_id: userId });
        await AdminPermission.deleteMany({ user_id: userId });
        const result = await User.findByIdAndDelete(userId);

        if (!result) throw new CustomError("user not found or already deleted", 404);

        return {
            status: 200,
            success: true,
            message: "successfully deleted"
        };
    }

    async changeUser(payload, userId, user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const findPermissionUser = await AdminPermission.findOne({ user_id });
        if (!findPermissionUser?.can_update) {
            throw new CustomError("no allowed update permission", 401);
        }

        if (payload.repeat_password !== payload.password) {
            throw new CustomError("password isn't match", 401);
        }

        const hashpassword = await bcrypt.hash(payload.password, 10);
        
        const result = await User.findByIdAndUpdate(
            userId,
            {
                username: payload.username,
                password: hashpassword,
                birth_date: payload.birth_date,
                gender: payload.gender,
                role: payload.role,
                branch_id: payload.branch_id
            },
            { new: true }
        ).select('-password');

        if (!result) throw new CustomError("user not found", 404);

        return {
            status: 200,
            success: true,
            data: result
        };
    }
}

export default UserService;