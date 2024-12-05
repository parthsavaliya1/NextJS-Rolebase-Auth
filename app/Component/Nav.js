"use client"; // Mark this as a client-side component

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const Nav = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) return null;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="flex justify-between items-center w-full px-6 py-4">
        <div className="text-lg font-bold text-gray-700">My Site</div>

        {/* Toggle Button for smaller screens */}
        <button
          onClick={toggleMenu}
          className="sm:hidden text-gray-700 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            ></path>
          </svg>
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } sm:flex sm:items-center sm:space-x-6 sm:bg-transparent`}
        >
          <Link
            href="/"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded sm:mt-0 no-underline"
          >
            Home
          </Link>
          <Link
            href="/product"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded sm:mt-0 no-underline"
          >
            Product
          </Link>

          {session?.user?.role === "admin" && (
            <Link
              href="/Admin"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded sm:mt-0 no-underline"
            >
              Admin
            </Link>
          )}

          <Link
            href="/ClientMember"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded sm:mt-0 no-underline"
          >
            Client Member
          </Link>
          <Link
            href="/Member"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white rounded sm:mt-0 no-underline"
          >
            Member
          </Link>

          <button
            onClick={handleLogout}
            className="block w-full sm:w-auto px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded mt-2 sm:mt-0"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>

  );
};

export default Nav;
