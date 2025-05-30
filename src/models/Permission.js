import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transport_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transport',
        required: true
    },
    can_create: {
        type: Boolean,
        default: false
    },
    can_read: {
        type: Boolean,
        default: false
    },
    can_delete: {
        type: Boolean,
        default: false
    },
    can_update: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Permission', permissionSchema);
