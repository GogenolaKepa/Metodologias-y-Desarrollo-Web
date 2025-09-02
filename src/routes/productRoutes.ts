import { Router } from "express";
import {
  createProduct,
  updateProduct,
  getProducts,
  getProduct,
  deleteProduct,
} from "../controllers/productController";
import { validateDto } from "../middlewares/validate-dto";
import { CreateProductDTO } from "../dto/create-producto.dto";
import { UpdateProductDTO } from "../dto/update-producto.dto";

const router = Router();

router.post("/", validateDto(CreateProductDTO), createProduct);
router.put("/:id", validateDto(UpdateProductDTO), updateProduct);

router.get("/", getProducts);
router.get("/:id", getProduct);
router.delete("/:id", deleteProduct);

export default router;
