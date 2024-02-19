import { ItemEntity } from "@/entities/items";
import { CreateItemDto } from "./types";

export class AuthenticationError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

export class ValidationError extends Error {
  private errors: Record<string, string | undefined>;
  constructor(errors: Record<string, string | undefined>) {
    super("Validation Error ocurred");
    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }
}

export const itemToCreateItemDto = (item: ItemEntity): CreateItemDto => {
  return {
    name: item.getName(),
    quantity: item.getQuantity(),
    userId: item.getUserId(),
  };
};

export const itemToDto = (item: ItemEntity) => {
  const itemId = item.getId();

  if (!itemId) {
    throw new Error("Expected Item id");
  }

  return {
    id: itemId,
    userId: item.getUserId(),
    name: item.getName(),
    quantity: item.getQuantity(),
    isLow: item.getIsLow(),
  };
};
