import User from "../models/User.js";
import CustomError from "../utils/CustomError.js";
import bcrypt from "bcrypt";
import tokenGenerate from "../utils/jwt.js";

class Register_and_Login {
    constructor() { }

    async register(payload) {
        const findUser = await User.findOne({ username: payload.username });

        if (findUser)
            throw new CustomError("User already exists", 403);

        if (payload.password !== payload.repeat_password) {
            throw new CustomError("repeat_password xato ", 400);
        }

        const hashpassword = await bcrypt.hash(payload.password, 10);

        const newUser = new User({
            username: payload.username,
            branch_id: payload.branch_id,
            password: hashpassword,
            birth_date: payload.birth_date,
            gender: payload.gender,
            role: payload.role || 'user'
        });

        const savedUser = await newUser.save();
        const { password, ...user } = savedUser.toObject();
        const token = tokenGenerate(user);

        return {
            status: 201,
            success: true,
            data: user,
            token
        };
    }

    async login(payload) {
        const findUser = await User.findOne({ username: payload.username });

        if (!findUser)
            throw new CustomError("User not found", 404);

        const isMatch = await bcrypt.compare(payload.password, findUser.password);

        if (isMatch)
            throw new CustomError("Username or password incorrect", 401);

        const { password, ...safeUser } = findUser.toObject();
        const token = tokenGenerate(safeUser);

        return {
            status: 200,
            success: true,
            data: safeUser,
            token
        };
    }
}

export default Register_and_Login;