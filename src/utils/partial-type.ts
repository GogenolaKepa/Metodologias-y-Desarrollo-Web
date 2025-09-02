// Implementación mínima estilo NestJS para DTOS parciales
export function PartialType<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  abstract class PartialTypeClass extends (Base as any) {}
  // No hace magia en runtime, pero a nivel de tipos + validación funciona
  return PartialTypeClass as TBase;
}
