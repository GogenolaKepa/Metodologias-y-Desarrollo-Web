import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app = express();
const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI!;

app.use(express.json({ limit: "10mb" }));
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Middleware ejecutado");
  console.log(req.body);
  next();
});

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const connectToDb = async () => {
  try {
    await mongoose.connect(mongoUri, {});
    console.log("MongoDB conectado");
  } catch (error) {
    console.error(`Error de conexión a MongoDB: ${error}`);
  }
};
connectToDb();
