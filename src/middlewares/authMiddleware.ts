import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];

    if (!token) return res.status(403).json({ message: "Token requerido" });

    try {
        jwt.verify(token, SECRET_KEY);
        next();
    } catch (err) {
        return res.status(401).json({ message: err });
    }
};
