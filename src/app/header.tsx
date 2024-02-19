import { Button } from "@/components/Button";
import { auth } from "@/lib/auth";
import Link from "next/link";
import React, { use } from "react";
import ThemeToggle from "./theme-toggle";

const Header = async () => {
  const { getUser } = await auth();
  const user = getUser();
  return (
    <div className="border-b border-b-white/30 py-4">
      <div className="container mx-auto flex  items-center justify-between">
        <Link href="/" className="flex gap-1 items-center text-xl">
          PantryTracker
        </Link>
        <div>
          {user && (
            <Link href="/dashboard">
              <Button variant={"ghost"}>Manage Pantry</Button>
            </Link>
          )}
        </div>
        <div className="flex justify-between gap-4">
          <ThemeToggle />
          {user ? (
            <Link href="/api/auth/signout">
              <Button>Sign out</Button>
            </Link>
          ) : (
            <Link href="/api/auth/signin/google">
              <Button>Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
