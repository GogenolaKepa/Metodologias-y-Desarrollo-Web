import { PartialType } from "../utils/partial-type";
import { CreateProductDTO } from "./create-producto.dto";

// Igual que el create, pero todos los campos pasan a ser opcionales
export class UpdateProductDTO extends PartialType(CreateProductDTO) {}
