import {
  registerUser,
  login,
  logout,
  socialLogin
} from "../controllers/userController";
import express from "express";
import validationMiddleware from "../middlewares/middleware";
import { CreateUserDto } from "../dto/create-user.dto";

const router = express.Router();

router.post("/register", validationMiddleware(CreateUserDto), registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/social-login", socialLogin);

export default router;
