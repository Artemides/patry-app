import { Item } from "@/db/schema";

export function mapAsDto(item: Item) {
  return {
    id: item.id,
    userId: item.userId,
    name: item.name,
    quantity: item.quantity,
    isLow: item.isLow,
  };
}
