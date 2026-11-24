import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    inStock: {
        type: Number,
        default: 0,
        min: 0,
        validate: Number.isInteger
    }
}, { _id: false });

const decorSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
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
        type: [String],
        default: []
    },
    colors: {
        type: [colorSchema],
        default: [],
        validate: {
            validator: value => value.length > 0,
            message: 'Добавьте хотя бы один цвет'
        }
    },
    dimensions: {
        type: String,
        default: ''
    }
}, 
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

decorSchema.virtual('inStock').get(function () {
    return this.colors.reduce(
        (sum, color) => sum + color.inStock,
        0
    );
});

decorSchema.virtual('finalPrice').get(function () {
    return Math.round(
        this.price * (1 - this.discount / 100)
    );
});

export default mongoose.model('Decor', decorSchema, 'decor');
