import mongoose from "mongoose";

const catalogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        default: "",
    },
    category:{
        type: String,
        required: true
    },
    price:{
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
    items: {
        type: [String],
        default: []
    },
    materials: {
        type: [String],
        default: []
    },
    colors: {
        type: [String],
        default: []
    },
    dimensions: {
        type: String,
        default: ''
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, 
{
    timestamps: true,
    toJSON: { virtuals: true }
})

catalogSchema.virtual('finalPrice').get(function () {
    return Math.round(this.price * (1 - this.discount / 100))
})

export default mongoose.model('Catalog', catalogSchema, 'catalog')