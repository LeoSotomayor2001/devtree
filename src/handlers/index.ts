import { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { validationResult } from "express-validator";

export const createAccount = async (req: Request, res: Response) => {
 
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    const error = new Error("El email ya esta registrado");
    res.status(409).json({ error: error.message });
    return;
  }

  // Dynamic import for 'slug'
  const { default: slug } = await import("slug");

  const handle = slug(req.body.handle, "");
  const handleExist = await User.findOne({ handle });
  if (handleExist) {
    const error = new Error("El nombre de usuario ya esta registrado");
    res.status(409).json({ error: error.message });
    return;
  }
  const user = new User(req.body);
  user.password = await hashPassword(password);
  user.handle = handle;
  await user.save();

  res.status(201).send("Usuario creado correctamente");
};

export const login = async (req: Request, res: Response) => {

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Usuario no registrado");
    return res.status(404).json({ error: error.message });
  }

  const isPasswordCorrect = await checkPassword(password, user.password)
  if (!isPasswordCorrect) {
    const error = new Error("Password Incorrecto");
    return res.status(401).json({ error: error.message });
  }

  res.send(`Bienvenido ${user.handle}`)
};