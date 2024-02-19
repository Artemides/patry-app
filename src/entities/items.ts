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
}
