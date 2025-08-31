import { Schema, model, InferSchemaType } from "mongoose";

const productSchema = new Schema({
  name:        { type: String, required: true, trim: true, minlength: 2 },
  price:       { type: Number, required: true, min: 0 },
  stock:       { type: Number, default: 0, min: 0 },
  description: { type: String, default: "", maxlength: 1000 },
  category:    { type: String, default: "general", trim: true },
  active:      { type: Boolean, default: true }
}, { timestamps: true });

export type ProductDoc = InferSchemaType<typeof productSchema>;
export default model<ProductDoc>("Product", productSchema);
