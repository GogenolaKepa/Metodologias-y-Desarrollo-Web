import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

type Class<T> = { new (...args: any[]): T };

export function validateDto<T extends object>(dtoClass: Class<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(dtoClass, req.body as object, {
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    });

    const errors = await validate(instance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.map(e => ({
          property: e.property,
          constraints: e.constraints,
        })),
      });
    }

    req.body = instance as unknown as T;
    next();
  };
}
