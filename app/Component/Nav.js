"use client"; // Mark this as a client-side component

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Nav = () => {
  const { data: session } = useSession();

  if (!session) return null;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="bg-gray-600 text-gray-100">
      <nav className="flex justify-between items-center w-full px-10 py-4">
        <div>My Site</div>
        <div className="flex gap-10">
          <Link href="/">Home</Link>

          {session?.user?.role === 'admin' && (
            <Link href="/Admin">Admin</Link>
          )}

          <Link href="/ClientMember">Client Member</Link>
          <Link href="/Member">Member</Link>

          <button onClick={() => handleLogout()} className="text-white bg-blue-500 px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
