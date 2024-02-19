import { auth } from "@/lib/auth";
import { AuthenticationError } from "./utils";
import { getItemByName, updateItem } from "@/data-access/items.persistence";
import { ItemEntity } from "@/entities/items";
import { mapAsDto } from "@/utils/dto";

export async function createItemUseCase(data: {
  name: string;
  quantity: number;
}) {
  const { getUser } = await auth();
  const user = getUser();
  if (!user) {
    throw new AuthenticationError();
  }

  const existingItem = await getItemByName(user.userId, data.name);
  if (existingItem) {
    const itemEntity = new ItemEntity({
      ...existingItem,
      quantity: existingItem.quantity + data.quantity,
    });

    await updateItem(mapAsDto(itemEntity));
  }
}
