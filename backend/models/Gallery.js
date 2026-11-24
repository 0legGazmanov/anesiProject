
import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    extraPrice: {
        type: Number,
        default: 0,
        min: 0,
        validate: Number.isSafeInteger
    }
}, 
{ _id: false });

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 2990
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 90
    },
    images: {
        type: [String],
        default: []
    },
    materials: {
        type: [optionSchema],
        default: []
    },
    colors: {
        type: [optionSchema],
        default: []
    },
    sizes: {
        type: [optionSchema],
        default: []
    }
}, 
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

gallerySchema.virtual('finalPrice').get(function () {
    return Math.round(
        this.price * (1 - this.discount / 100)
    );
});

const Gallery = mongoose.model('Gallery', gallerySchema, 'gallery');

export default Gallery;
