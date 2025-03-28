"use client"; 

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ProfileDropdown } from "@/components/layout/Profile-Dropdown";
import Link from "next/link";
import { User } from "@/types/User";

export default function AuthStatus() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    }
    fetchUser();
  }, [supabase.auth]);

  return user ? (
    <ProfileDropdown />
  ) : (
    <Link
      href="/login"
      className="text-gray-500 text-md hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 outline-1 p-2 px-4 transform dark:hover:bg-gray-900 shadow dark:shadow-white rounded-xl"
      prefetch={false}
    >
      Login
    </Link>
  );
}
