import Order from "../models/Order.js";
import Catalog from "../models/Catalog.js";
import Gallery from "../models/Gallery.js";
import Decor from "../models/Decor.js";
import User from "../models/User.js";
import mongoose from 'mongoose';

const models = {
    catalog: Catalog,
    gallery: Gallery,
    decor: Decor
};

const getAll = async (req, res) => {
    try {
        const orders = await Order.find();

        res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getByUser = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.params.userId
        });

        res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


const create = async (req, res) => {
    try {
        const { user, products, person, address, comment } = req.body;

        if (!mongoose.isValidObjectId(user)) {
            return res.status(400).json({ message: "Invalid user" });
        }

        const customer = await User.findById(user);

        if (!customer) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const requiredPerson = ['firstName', 'lastName', 'email', 'phone'];
        const requiredAddress = ['city', 'street', 'house'];

        if (
            requiredPerson.some(key => !String(person?.[key] ?? '').trim()) ||
            requiredAddress.some(key => !String(address?.[key] ?? '').trim())
        ) {
            return res.status(400).json({
                message: "Contact information and address are required"
            });
        }

        const orderProducts = [];

        for (const item of products) {
            if (!item || !Object.hasOwn(models, item.type)) {
                return res.status(400).json({
                    message: "Invalid product type"
                });
            }

            if (!mongoose.isValidObjectId(item.productId)) {
                return res.status(400).json({
                    message: "Invalid product ID"
                });
            }

            if (!Number.isInteger(item.quantity) || item.quantity < 1) {
                return res.status(400).json({
                    message: "Invalid quantity"
                });
            }

            const product = await models[item.type].findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            let configuration = {};
            let price = product.finalPrice;

            if (item.type === 'gallery') {
                const { material, color, size } = item.configuration || {};

                const selectedMaterial = product.materials.find(
                    option => option.name === material
                );
                const selectedColor = product.colors.find(
                    option => option.name === color
                );
                const selectedSize = product.sizes.find(
                    option => option.name === size
                );
                
                console.log('Gallery configuration:', {
                    received: { material, color, size },
                    available: {
                        materials: product.materials.map(option => option.name),
                        colors: product.colors.map(option => option.name),
                        sizes: product.sizes.map(option => option.name)
                    }
                });

                if (!selectedMaterial || !selectedColor || !selectedSize) {
                    return res.status(400).json({
                        message: "Invalid gallery configuration"
                    });
                }

                configuration = { material, color, size };

                const basePrice =
                    product.price +
                    selectedMaterial.extraPrice +
                    selectedColor.extraPrice +
                    selectedSize.extraPrice;

                price = Math.round(
                    basePrice * (1 - product.discount / 100)
                );
            }

            if (item.type === 'decor') {
                const color = item.configuration?.color;

                const selectedColor = product.colors.find(
                    option => option.name === color
                );

                if (!selectedColor) {
                    return res.status(400).json({
                        message: "Invalid decor color"
                    });
                }

                configuration = { color };
            }

            if (item.type === 'catalog' && !product.inStock) {
                return res.status(400).json({
                    message: "Product out of stock"
                });
            }

            const existingItem = orderProducts.find(p =>
                p.productId.toString() === product._id.toString() &&
                p.type === item.type &&
                p.configuration?.material === configuration.material &&
                p.configuration?.color === configuration.color &&
                p.configuration?.size === configuration.size
            );

            const quantity = item.quantity + (existingItem?.quantity || 0);

            if (item.type === 'decor') {
                const selectedColor = product.colors.find(
                    option => option.name === configuration.color
                );

                if (quantity > selectedColor.inStock) {
                    return res.status(400).json({
                        message: "Not enough products in stock"
                    });
                }
            }

            if (existingItem) {
                existingItem.quantity = quantity;
            } else {
                orderProducts.push({
                    productId: product._id,
                    type: item.type,
                    title: product.title,
                    configuration,
                    price,
                    quantity: item.quantity
                });
            }
        }

        const totalPrice = orderProducts.reduce(
            (total, product) => total + product.price * product.quantity,
            0
        );

        const order = await Order.create({
            user,
            products: orderProducts,
            person,
            address,
            comment: comment ?? '',
            totalPrice,
            status: 'pending'
        });

        res.status(201).json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


const updateStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export {
    getAll,
    getById,
    getByUser,
    create,
    updateStatus
};