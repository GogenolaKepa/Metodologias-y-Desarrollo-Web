import { Type } from "class-transformer";
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from "class-validator";

export class CreateProductDTO {
  @IsString({ message: "name debe ser string" })
  @Length(5, 20, { message: "name debe tener entre 5 y 20 caracteres" })
  name!: string; // requerido (min:5, max:20)

  @IsString({ message: "descrip debe ser string" })
  @MaxLength(20, { message: "descrip como máximo 20 caracteres" })
  @IsOptional()
  descrip?: string; // opcional (max:20)

  @Type(() => Number)
  @IsInt({ message: "stock debe ser entero" })
  @Min(1, { message: "stock mínimo 1" })
  stock!: number; // requerido (min:1)

  @Type(() => Number)
  @IsNumber({}, { message: "price debe ser número" })
  @Min(0, { message: "price mínimo 0" })
  price!: number; // requerido (min:0)

  @IsString({ message: "category debe ser string" })
  @IsNotEmpty({ message: "category es requerido" })
  category?: string; // requerido
}
