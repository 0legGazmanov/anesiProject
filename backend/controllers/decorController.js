import Decor from "../models/Decor.js";

const getAll = async (req, res) => {
    try {
        const products = await Decor.find();

        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getById = async (req, res) => {
    try {
        const product = await Decor.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const create = async (req, res) => {
    try {
        const product = await Decor.create(req.body);

        res.status(201).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const update = async (req, res) => {
    try {
        const product = await Decor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const remove = async (req, res) => {
    try {
        const product = await Decor.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export {
    getAll,
    getById,
    create,
    update,
    remove
};