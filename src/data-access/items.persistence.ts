import { CreateItemDto, ItemDto } from "@/use-cases/types";
import { db } from "@/db";
import { items } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { mapAsDto } from "@/utils/dto";

export const createItem = async (item: CreateItemDto) => {
  await db.insert(items).values(item);
};

export const deleteItem = async (itemId: number) => {
  await db.delete(items).where(eq(items.id, itemId));
};

export const getItem = async (itemId: number): Promise<ItemDto> => {
  const foundItem = await db.query.items.findFirst({
    where: eq(items.id, itemId),
  });
  if (!foundItem) {
    throw new Error(`Item ${itemId} not found`);
  }

  return mapAsDto(foundItem);
};

export const getItemByName = async (
  userId: string,
  name: string
): Promise<ItemDto | undefined> => {
  const foundItem = await db.query.items.findFirst({
    where: and(eq(items.userId, userId), eq(items.name, name)),
  });

  if (!foundItem) {
    return undefined;
  }

  return mapAsDto(foundItem);
};

export const getItems = async (): Promise<ItemDto[]> => {
  const items = await db.query.items.findMany();
  return items.map(mapAsDto);
};

export const updateItem = async (item: ItemDto) => {
  await db.update(items).set(item).where(eq(items.id, item.id));
};
