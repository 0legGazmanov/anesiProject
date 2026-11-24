import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        enum: ['catalog', 'gallery', 'decor'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    configuration: {
        material: String,
        color: String,
        size: String
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
        validate: Number.isInteger
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: {
        type: [orderItemSchema],
        required: true,
        validate: value => value.length > 0
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    person: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    address: {
        city: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        house: {
            type: String,
            required: true
        },
        apartment: {
            type: String,
            default: ""
        }
    },
    comment: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: [
            'pending',
            'confirmed',
            'processing',
            'shipped',
            'delivered',
            'cancelled'
        ],
        default: 'pending'
    }
}, 
{
    timestamps: true
});

export default mongoose.model('Order', orderSchema, 'orders');