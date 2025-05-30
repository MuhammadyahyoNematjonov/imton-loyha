import jwt from 'jsonwebtoken';

const tokenGenerate = (payload) => {
    const secret = process.env.JWT_SECRET || 'olmachaqanij';
    return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || 'olmachaqanij';
    return jwt.verify(token, secret);
};

export default tokenGenerate;