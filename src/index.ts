import express from "express";
import dotenv from "dotenv";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes"
import productRoutes from "./routes/productRoutes";

dotenv.config();
const app = express();
const port = process.env.PORT;
const mongoUri = process.env.MONGODB_URI!;

app.use(express.json({ limit: '10mb' }));

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Holaaaa!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

const connectToDb = async () => {
    try {
        await mongoose.connect(mongoUri, {
        });
        console.log('MongoDB CONECTADO!!!');

    } catch (error) {
        console.error(`Error de conexión a MongoDB: ${error}`);
    }
}
connectToDb();