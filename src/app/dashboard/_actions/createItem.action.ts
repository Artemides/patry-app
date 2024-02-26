import { createItemUseCase } from "@/use-cases/items";
import { itemSchema, quantitySchema } from "@/use-cases/shemas";
import { ActionState } from "@/use-cases/types";
import { ValidationError } from "@/use-cases/utils";
import { revalidatePath } from "next/cache";

type CreateItemAction = {
  state: ActionState;
  error?: string | Record<string, string | undefined>;
};

export async function createItemAction(
  formData: FormData
): Promise<CreateItemAction> {
  const form = {
    name: formData.get("name") as string,
    quantity: Number(formData.get("quantity")),
  };

  try {
    await createItemUseCase(form);
    revalidatePath("/");

    return {
      state: "success",
    };
  } catch (error) {
    const err = error as Error;
    if (err instanceof ValidationError) {
      return {
        state: "error",
        error: err.getErrors(),
      };
    }

    return {
      state: "error",
      error: err.message,
    };
  }
}
