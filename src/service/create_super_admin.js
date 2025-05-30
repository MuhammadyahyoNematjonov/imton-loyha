import bcrypt from "bcrypt";
import User from "../models/User.js";

async function super_adminCreate() {
    try {
        const username = 'yahyobek';
        const password = process.env.PASSWORD || 'admin';

        const existingSuperAdmin = await User.findOne({ 
            username, 
            role: 'super_admin' 
        });

        if (existingSuperAdmin) {
            console.log('superadin yaratildi!');
            return;
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const role = 'super_admin';
        const gender = 'male';
        const birth_date = new Date('1990-01-01');

        const superAdmin = new User({
            username,
            password: hashpassword,
            birth_date,
            gender,
            role
        });

        await superAdmin.save();
        console.log('Super admin created successfully');
    } catch (error) {
        console.error('Error creating super admin:', error);
    }
}

export default super_adminCreate;

