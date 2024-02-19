import { auth } from "@/lib/auth";
import {
  AuthenticationError,
  ValidationError,
  itemToCreateItemDto,
  itemToDto,
} from "./utils";
import {
  createItem,
  deleteItem,
  getItem,
  getItemByName,
  updateItem,
} from "@/data-access/items.persistence";
import { ItemEntity, ItemEntityValidationError } from "@/entities/items";

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

    await updateItem(itemToDto(itemEntity));
    return;
  }

  try {
    const itemEntity = new ItemEntity({
      userId: user.userId,
      name: data.name,
      quantity: data.quantity,
    });

    await createItem(itemToCreateItemDto(itemEntity));
  } catch (error) {
    const err = error as ItemEntityValidationError;

    throw new ValidationError(err.getErrors());
  }
}

export const updateItemStockUseCase = async (data: {
  itemId: number;
  quantity: number;
}) => {
  const { getUser } = await auth();
  const user = getUser();
  if (!user) {
    throw new AuthenticationError();
  }
  const foundItem = await getItem(data.itemId);
  const item = new ItemEntity(foundItem);

  item.updateStock(data.quantity);
  await updateItem(itemToDto(item));
  return itemToDto(item);
};

export const deleteItemUseCase = async (data: { itemId: number }) => {
  const { getUser } = await auth();
  const user = getUser();
  if (!user) {
    throw new AuthenticationError();
  }

  await deleteItem(data.itemId);
};

export const markAsLowUseCase = async (data: { itemId: number }) => {
  const { getUser } = await auth();
  const user = getUser();
  if (!user) {
    throw new AuthenticationError();
  }

  const foundItem = await getItem(data.itemId);
  const item = new ItemEntity(foundItem);
  item.markAsLow();
  await updateItem(itemToDto(item));
  return itemToDto(item);
};

export const unmarkAsLowUseCase = async (data: { itemId: number }) => {
  const { getUser } = await auth();
  const user = getUser();
  if (!user) {
    throw new AuthenticationError();
  }

  const foundItem = await getItem(data.itemId);
  const item = new ItemEntity(foundItem);
  item.unmarkAsLow();
  await updateItem(itemToDto(item));
  return itemToDto(item);
};
