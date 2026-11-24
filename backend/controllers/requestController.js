import Request from "../models/Request.js";

const getAll = async (req, res) => {
    try {
        const requests = await Request.find();

        res.status(200).json(requests);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getById = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        res.status(200).json(request);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const create = async (req, res) => {
    try {
        const { user, firstName, lastName, email, phone, description} = req.body;
        const request = await Request.create({
            user,
            firstName,
            lastName,
            email,
            phone,
            description,
            status: "pending"
        });

        res.status(201).json(request);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateStatus = async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        res.status(200).json(request);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

export {
    getAll,
    getById,
    create,
    updateStatus
};