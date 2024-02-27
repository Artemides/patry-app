"use server";

import { ToogleItemUseCase, deleteItemUseCase } from "@/use-cases/items";
import { idSchema } from "@/use-cases/shemas";
import { ActionState } from "@/use-cases/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ToggleItemAction = {
  status: ActionState;
  error?: string;
};

export const ToogleItemAction = async (
  status: ToggleItemAction,
  formdata: FormData
): Promise<ToggleItemAction> => {
  try {
    const form = {
      itemId: formdata.get("itemId") as string,
    };
    const itemId = z.coerce.number().parse(form.itemId);

    await ToogleItemUseCase({ itemId });
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
