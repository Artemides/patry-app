import { ZodError, z } from "zod";
type ValidatedFields = "name" | "userId" | "isLow" | "quantity";
export class ItemEntityValidationError extends Error {
  private errors: Record<ValidatedFields, string | undefined>;

  constructor(errors: Record<ValidatedFields, string | undefined>) {
    super("An error ocurred validating an Item");
    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }
}

export class ItemEntity {
  private id?: number;
  private userId: string;
  private name: string;
  private quantity: number;
  private isLow: boolean;

  constructor({
    id,
    userId,
    name,
    quantity,
    isLow = false,
  }: {
    id?: number;
    userId: string;
    name: string;
    quantity: number;
    isLow?: boolean;
  }) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.quantity = quantity;
    this.isLow = isLow;
    this.validate();
  }

  getId() {
    return this.id;
  }

  getUserId() {
    return this.userId;
  }

  getName() {
    return this.name;
  }

  getQuantity() {
    return this.quantity;
  }

  getIsLow() {
    return this.isLow;
  }

  setIsLow(isLow: boolean) {
    this.isLow = isLow;
  }

  setQuantity(quantity: number) {
    this.quantity = quantity;
  }

  updateStock(quantity: number) {
    if (quantity < 0) {
      throw new Error("Item's stock must be equal or greader than 0");
    }

    if (quantity === 0) {
      this.isLow = false;
    }

    this.quantity = quantity;
  }

  decrement() {
    if (this.quantity === 0) {
      throw new Error("Cannot decrement an Item out of stock");
    }

    this.quantity--;

    if (this.quantity === 0) {
      this.isLow = false;
    }
  }

  markAsLow() {
    if (this.quantity === 0) {
      throw new Error("Cannot mark as low an Item out of stock");
    }

    this.isLow = true;
  }

  unmarkAsLow() {
    this.isLow = false;
  }

  validate() {
    const itemSchema = z.object({
      userId: z.string().min(1),
      name: z
        .string()
        .min(1)
        .regex(/^[a-z]+$/, "Item name must be a word with no letters"),
      quantity: z.number().min(0),
      isLow: z.boolean().default(false),
    });

    try {
      itemSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new ItemEntityValidationError({
        userId: errors.userId?.[0],
        name: errors.name?.[0],
        isLow: errors.isLow?.[0],
        quantity: errors.quantity?.[0],
      });
    }
  }
}
