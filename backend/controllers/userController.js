import User from "../models/User.js";

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password} = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            role: "user"
        });

        const result = user.toJSON();
        delete result.password;

        res.status(201).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || typeof password !== "string") {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email })
            .select("+password");

        if (!user || user.password !== password) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const result = user.toJSON();
        delete result.password;

        res.status(200).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const update = async (req, res) => {
    try {
        const { firstName, lastName, email, phone } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                firstName,
                lastName,
                email,
                phone
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    }catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export {
    register,
    login,
    getById,
    update
};