import { Request, Response } from "express";
import User from "../models/userModel";
import { CreateUserDto } from "../dto/create-user.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user : CreateUserDto = req.body;
    const hashPassword = await bcrypt.hash(user.password, 10);
    const newUser = await User.create({ ...user, password: hashPassword });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, req.body);

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN!;
  const findUser = await User.findOne({ email });

  if (!findUser) return res.status(404).json({ message: "Usuario no encontrado" });

  const isMatch = await bcrypt.compare(password, findUser.password);
  if (!isMatch) return res.status(401).json({ message: "Credenciales inválidas" });

  if (!jwtSecret) {
    return res.status(500).json({ message: "JWT no definido" });
  }
  const token = jwt.sign(
    { userId: findUser._id.toString(), email: findUser.email },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

  return res.json({ token });
};
