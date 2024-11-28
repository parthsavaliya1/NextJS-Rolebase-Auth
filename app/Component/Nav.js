"use client"; // Mark this as a client-side component

import { signOut, useSession } from "next-auth/react"; // Use `useSession` for client-side session management
import Link from "next/link";

const Nav = () => {
  const { data: session } = useSession(); // Get session data client-side

  // If the user is not authenticated, return null (you could show login link here instead)
  if (!session) return null;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" }); // Sign out and redirect to login
  };

  return (
    <header className="bg-gray-600 text-gray-100">
      <nav className="flex justify-between items-center w-full px-10 py-4">
        <div>My Site</div>
        <div className="flex gap-10">
          <Link href="/">Home</Link>
          <Link href="/Admin">Admin</Link>
          <Link href="/ClientMember">Client Member</Link>
          <Link href="/Member">Member</Link>
          <button onClick={()=>handleLogout()} className="text-white bg-blue-500 px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
