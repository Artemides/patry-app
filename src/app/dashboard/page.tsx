import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { getItems } from "@/data-access/items.persistence";
import React from "react";
import CreateItemForm from "./components/CreateItemForm";
import { ItemsTable } from "./components/ItemsTable";
import { ItemDto } from "@/use-cases/types";

type PantryStat = {
  lowItems: ItemDto[];
  stockedItems: ItemDto[];
  unstockedItems: ItemDto[];
};

const DashboardPage = async () => {
  const items = await getItems();
  const { lowItems, stockedItems, unstockedItems } = items.reduce<PantryStat>(
    (stats, item): PantryStat => {
      if (item.quantity) {
        stats.stockedItems.push(item);
      } else {
        stats.unstockedItems.push(item);
      }

      if (item.isLow && item.quantity) {
        stats.lowItems.push(item);
      }
      return stats;
    },
    {
      lowItems: [],
      stockedItems: [],
      unstockedItems: [],
    }
  );

  return (
    <main className=" grid grid-cols-3 p-12 gap-12 max-w-screen-xl mx-auto">
      <div className="col-span-3 md:col-span-2">
        <h1 className="text-4xl mb-8">Your Pantry</h1>
        <Tabs defaultValue="items">
          <TabsList className="w-full flex`">
            <TabsTrigger value="items">
              In Stock {stockedItems.length}
            </TabsTrigger>
            <TabsTrigger value="low">Running Low {lowItems.length}</TabsTrigger>
            <TabsTrigger value="out">
              Out of Stock {unstockedItems.length}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="items">
            <ItemsTable items={stockedItems} />
          </TabsContent>
          <TabsContent value="low">
            <ItemsTable items={lowItems} />
          </TabsContent>
          <TabsContent value="out">
            <ItemsTable items={unstockedItems} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="col-span-3 md:col-span-1">
        <CreateItemForm />
      </div>
    </main>
  );
};
export default DashboardPage;
