import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { getItems } from "@/data-access/items.persistence";
import React from "react";

type PantryStat = {
  lowItems: number;
  stockedItems: number;
  unstockedItems: number;
};

const DashboardPage = async () => {
  const items = await getItems();

  const { lowItems, stockedItems, unstockedItems } = items.reduce(
    (stats, item): PantryStat => {
      if (item.quantity) {
        stats.stockedItems += 1;
      } else {
        stats.unstockedItems += 1;
      }

      stats.lowItems =
        item.isLow && item.quantity ? ++stats.lowItems : stats.lowItems;

      return stats;
    },
    {
      lowItems: 0,
      stockedItems: 0,
      unstockedItems: 0,
    }
  );

  return (
    <main className=" grid grid-cols-3 p-12 gap-12 max-w-screen-xl mx-auto">
      <div className="col-span-3 md:col-span-2">
        <h1 className="text-4xl mb-8">Your Pantry</h1>
        <Tabs defaultValue="items">
          <TabsList className="w-full grid grid-cols-3`">
            <TabsTrigger value="items">In Stock {stockedItems}</TabsTrigger>
            <TabsTrigger value="low">Running Low {stockedItems}</TabsTrigger>
            <TabsTrigger value="out"> Out of Stock {stockedItems}</TabsTrigger>
          </TabsList>
          <TabsContent value="items"></TabsContent>
          <TabsContent value="low"></TabsContent>
          <TabsContent value="out"></TabsContent>
        </Tabs>
      </div>
      <div className="col-span-3 md:col-span-1"></div>
    </main>
  );
};
export default DashboardPage;
