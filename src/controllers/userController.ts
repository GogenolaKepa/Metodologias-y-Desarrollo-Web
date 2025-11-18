import { Request, Response } from "express";
import User from "../models/userModel";
import { CreateUserDto } from "../dto/create-user.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { firebaseAuth } from "../config/firebase-admin";

dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user: CreateUserDto = req.body;
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
  const jwtAccessSecret = process.env.JWT_SECRET;
  const jwtAccessExpiresIn = process.env.JWT_EXPIRES_IN!;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
  const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN!;
  const findUser = await User.findOne({ email });

  if (!findUser) return res.status(404).json({ message: "Usuario no encontrado" });

  const isMatch = await bcrypt.compare(password, findUser.password);
  if (!isMatch) return res.status(401).json({ message: "Credenciales inválidas" });

  if (!jwtAccessSecret || !jwtRefreshSecret) {
    return res.status(500).json({ message: "JWT no definido" });
  }
  const accessToken = jwt.sign(
    { userId: findUser._id.toString(), email: findUser.email },
    jwtAccessSecret,
    { expiresIn: jwtAccessExpiresIn }
  );

  const refreshToken = jwt.sign(
    { userId: findUser._id.toString() },
    jwtRefreshSecret,
    { expiresIn: jwtRefreshExpiresIn }
  );

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 1000 // 1 minute
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.status(200).json(findUser);
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.json({ message: "Logout exitoso" });
};

export const socialLogin = async (req: Request, res: Response) => {
  try {
    const jwtAccessSecret = process.env.JWT_SECRET!;
    const jwtAccessExpiresIn = process.env.JWT_EXPIRES_IN!;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
    const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN!;
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({ message: "Token requerido" });
    }

    // Verificar token de Firebase
    const decodedToken = await firebaseAuth.verifyIdToken(firebaseToken);

    const { uid, email, name, picture } = decodedToken;

    // Buscar o crear usuario en tu DB
    let user = await User.findOne({ email });

    if (!user) {
      // Crear nuevo usuario desde red social
      user = await User.create({
        email: email,
        name: name || email?.split('@')[0],
        password: jwtAccessSecret
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      jwtAccessSecret,
      { expiresIn: jwtAccessExpiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: user._id.toString() },
      jwtRefreshSecret,
      { expiresIn: jwtRefreshExpiresIn }
    );

    // Enviar cookies (tu sistema actual)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log(user);

    return res.status(200).json(user);

  } catch (error) {
    console.error('Social login error:', error);
    return res.status(401).json({ message: "Token inválido" });
  }
};