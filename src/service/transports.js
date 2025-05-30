import Transport from "../models/Transport.js";
import User from "../models/User.js";
import AdminPermission from "../models/AdminPermission.js";
import Permission from "../models/Permission.js";
import CustomError from "../utils/CustomError.js";
import path from "path";

class TransportService {
    constructor() { }

    async getTransport(branch_id, user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const findPermissionUser = await AdminPermission.findOne({ user_id });
        if (!findPermissionUser?.can_read) {
            throw new CustomError("no allowed read permission", 401);
        }

        const findBranchTransport = await Transport.find({ branch_id }).populate('branch_id', 'name location');

        return {
            status: 200,
            success: true,
            data: findBranchTransport
        };
    }

    async getModel(model, user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const findPermissionUser = await AdminPermission.findOne({ user_id });
        // if (!findPermissionUser?.can_read) {
        //     throw new CustomError("no allowed read permission", 401);
        // }

        const findBranchTransport = await Transport.find({ model }).populate('branch_id', 'name location');

        return {
            status: 200,
            success: true,
            data: findBranchTransport
        };
    }

    async addTransport(payload, user_id, img) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const findPermissionUser = await AdminPermission.findOne({ user_id });
        // if (!findPermissionUser?.can_create) {
        //     throw new CustomError("no allowed create permission", 401);
        // }

        const filename = new Date().getTime() + "-" + Math.round(Math.random() * 1e9) + img.name;
        await new Promise((resolve, reject) => {
            img.mv(path.join(process.cwd(), "src", "uploads", filename), (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        const newTransport = new Transport({
            model: payload.model,
            color: payload.color,
            img: filename,
            price: payload.price,
            branch_id: payload.branch_id
        });

        const result = await newTransport.save();

        return {
            status: 201,
            success: true,
            data: result
        };
    }

    async changeTransport(payload, transport_id, user_id, img) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const findPermissionUser = await AdminPermission.findOne({ user_id });
            // if (!findPermissionUser?.can_update) {
            //     throw new CustomError("no allowed update permission", 401);
            // }

        const findTransport = await Transport.findById(transport_id);
        if (!findTransport) throw new CustomError("transport not found", 404);

        const filename = new Date().getTime() + "-" + Math.round(Math.random() * 1e9) + img.name;
        await new Promise((res, rej) => {
            img.mv(path.join(process.cwd(), "src", "uploads", filename), (err) => {
                if (err) rej(err);
                else res();
            });
        });

        const result = await Transport.findByIdAndUpdate(
            transport_id,
            {
                model: payload.model,
                color: payload.color,
                img: filename,
                price: payload.price,
                branch_id: payload.branch_id
            },
            { new: true }
        );

        return {
            status: 200,
            success: true,
            data: result
        };
    }

    async deleteTransport(transport_id, user_id) {
        const findAdmin = await User.findById(user_id);
        if (!findAdmin) throw new CustomError("admin not found", 404);

        const findPermissionUser = await AdminPermission.findOne({ user_id });
        // if (!findPermissionUser?.can_delete) {
        //     throw new CustomError("no allowed delete permission", 401);
        // }

        const findTransport = await Transport.findById(transport_id);
        if (!findTransport) throw new CustomError("transport not found", 404);

        await Permission.deleteMany({ transport_id });
        const result = await Transport.findByIdAndDelete(transport_id);

        if (!result) throw new CustomError("transport already deleted", 404);

        return {
            status: 200,
            success: true,
            message: "Transport deleted successfully"
        };
    }
}

export default TransportService;
