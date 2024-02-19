export type ItemDto = {
  id: number;
  userId: string;
  name: string;
  quantity: number;
  isLow: boolean;
};

export type CreateItemDto = {
  userId: string;
  name: string;
  quantity: number;
};
