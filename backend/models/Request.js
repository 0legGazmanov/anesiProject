import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        default: "",
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: [
            'pending',
            'processing',
            'completed',
            'cancelled'
        ],
        default: 'pending'
    }
}, 
{
    timestamps: true
});

export default mongoose.model('Request', requestSchema, 'requests');