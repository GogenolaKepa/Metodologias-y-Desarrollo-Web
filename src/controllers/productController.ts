import { Request, Response } from "express";
import Product from "../models/productModel";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const doc = await Product.create(req.body);
    res.status(201).json(doc);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const getProducts = async (_req: Request, res: Response) => {
  const docs = await Product.find().lean();
  res.json(docs);
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const doc = await Product.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(doc);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const doc = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).lean();
    if (!doc) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(doc);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const doc = await Product.findByIdAndDelete(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};
