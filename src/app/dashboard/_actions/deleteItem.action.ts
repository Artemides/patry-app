"use server";

import { deleteItemUseCase } from "@/use-cases/items";
import { idSchema } from "@/use-cases/shemas";
import { ActionState } from "@/use-cases/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type DeleteItemAction = {
  status: ActionState;
  error?: string;
};

export const deleteItemAction = async (
  status: DeleteItemAction,
  formdata: FormData
): Promise<DeleteItemAction> => {
  try {
    const form = {
      itemId: formdata.get("itemId"),
    };
    const itemId = idSchema.parse(form.itemId);

    await deleteItemUseCase({ itemId });
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
      error: "something wen't wrong",
    };
  }
};
