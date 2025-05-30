import User from "../models/User.js";
import AdminPermission from "../models/AdminPermission.js";
import Transport from "../models/Transport.js";
import Branch from "../models/Branch.js";
import CustomError from "../utils/CustomError.js";
import bcrypt from "bcrypt";

class AdminService {
    constructor() { }

    async addAdmin(payload) {
        const findAdmin = await User.findOne({ username: payload.username });
        if (findAdmin) throw new CustomError("admin already exist", 403);

        const hashpassword = await bcrypt.hash(payload.password, 10);
        if (payload.role !== 'admin' && payload.role !== 'super_admin') {
            throw new CustomError("role must be 'admin' or 'super_admin'", 400);
        }

        const newAdmin = new User({
            username: payload.username,
            password: hashpassword,
            birth_date: payload.birth_date,
            gender: payload.gender,
            role: payload.role,
            branch_id: payload.branch_id
        });

        const savedAdmin = await newAdmin.save();
        const { password, ...adminData } = savedAdmin.toObject();

        return {
            status: 201,
            success: true,
            data: adminData
        };
    }

    async adminsRole() {
        const result = await User.find({ role: 'admin' }).select('-password');
        return {
            status: 200,
            success: true,
            data: result
        };
    }

    async adminsUsername(username) {
        const result = await User.findOne({ username }).select('-password');
        return {
            status: 200,
            success: true,
            data: result
        };
    }

    async adminInfo(username) {
        const result = await User.findOne({ username })
            .populate('branch_id')
            .select('-password');
        
        if (!result) {
            throw new CustomError("Admin not found", 404);
        }

        // Get transports for this admin's branch
        const transports = await Transport.find({ branch_id: result.branch_id });

        return {
            status: 200,
            success: true,
            data: {
                ...result.toObject(),
                transports
            }
        };
    }

    async deleteAdmin(adminId) {
        const checkAdmin = await User.findOne({ 
            _id: adminId, 
            role: { $in: ['admin', 'super_admin'] } 
        });
        
        if (!checkAdmin) {
            throw new CustomError("Admin not found", 404);
        }

        await AdminPermission.deleteMany({ user_id: adminId });
        const deleteResult = await User.findByIdAndDelete(adminId);

        if (!deleteResult) {
            throw new CustomError("Admin already deleted or not found", 404);
        }

        return {
            status: 200,
            success: true,
            message: "successfully deleted"
        };
    }
}

export default AdminService;