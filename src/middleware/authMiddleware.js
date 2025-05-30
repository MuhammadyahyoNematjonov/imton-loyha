import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import CustomError from '../utils/CustomError.js';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new CustomError('yoq token kerak', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here');
        const user = await User.findById(decoded._id).select('-password');
        
        if (!user) {
            throw new CustomError('Token is not valid', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError(`User role ${req.user.role} is not authorized to access this route`, 403);
        }
        next();
    };
};