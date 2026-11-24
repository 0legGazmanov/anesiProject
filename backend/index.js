import express from 'express';
import connectDB from './config/db.js';
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

import catalogRoutes from "./routes/catalogRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import decorRoutes from "./routes/decorRoutes.js";
import userRouter from "./routes/userRoutes.js";
import requestRouter from "./routes/requestRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());
app.use("/catalog", catalogRoutes);
app.use("/gallery", galleryRoutes);
app.use("/decor", decorRoutes);
app.use("/users", userRouter);
app.use("/requests", requestRouter);
app.use("/orders", orderRouter);

app.get('/', (req, res) => {
    res.json({ message: 'ANESI is running' });
})

async function start() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        });
    } catch (error) {
        console.error('Server error:', error.message);
        process.exit(1);
    }
}

start();