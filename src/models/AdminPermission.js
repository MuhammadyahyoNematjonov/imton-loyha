import mongoose from 'mongoose';

const adminPermissionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    can_create: {
        type: Boolean,
        default: false
    },
    can_read: {
        type: Boolean,
        default: true
    },
    can_delete: {
        type: Boolean,
        default: false
    },
    can_update: {
        type: Boolean,
        default: false
    },
    can_add_permission: {
        type: Boolean,
        default: false
    },
    can_add_admin: {
        type: Boolean,
        default: false
    },
    can_control_branch: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('AdminPermission', adminPermissionSchema);
