import { auth } from "@/lib/auth";
import Link from "next/link";
import React, { use } from "react";

const header = async () => {
  const { getUser } = await auth();
  const user = getUser();
  return (
    <div className="border-b py-4">
      <div className="container mx-auto flex  items-center justify-between">
        <Link href="/" className="flex gap-1 items-center text-xl">
          PantryTracker
        </Link>
        <div>{user && <Link href="/dashboard"></Link>}</div>
      </div>
    </div>
  );
};

export default header;
