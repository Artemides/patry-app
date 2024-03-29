"use server";

import { updateItemStockUseCase } from "@/use-cases/items";
import { idSchema, quantitySchema } from "@/use-cases/shemas";
import { ActionState } from "@/use-cases/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type UpdateStockAction = {
  status: ActionState;
  error?: string;
};

export const updateStockAction = async (
  statis: UpdateStockAction,
  formdata: FormData
): Promise<UpdateStockAction> => {
  try {
    const form = {
      itemId: formdata.get("itemId"),
      quantity: formdata.get("quantity"),
    };
    const itemId = z.coerce.number().parse(form.itemId);
    const quantity = z.coerce.number().parse(form.quantity);

    await updateItemStockUseCase({ itemId, quantity });
    revalidatePath("/");

    return {
      status: "success",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: "error",
        error: error.issues.join(" err: "),
      };
    }
    return {
      status: "error",
    };
  }
};
