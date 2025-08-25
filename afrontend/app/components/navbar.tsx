"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-black shadow-[0_1px_0_0_rgba(255,255,255,0.1)]  fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            MyApp
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link href="/profile" className="hover:text-blue-600">
              Profile
            </Link>
            <Link href="/login" className="hover:text-blue-600">
              Login
            </Link>
            <Link href="/register" className="hover:text-blue-600">
              Register
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black shadow-lg transform transition-transform duration-300 ease-in-out z-40 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-bold text-blue-600">MyApp</span>
          <button onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col space-y-4 p-4">
          <Link href="/" className="hover:text-blue-600" onClick={toggleSidebar}>
            Home
          </Link>
          <Link href="/profile" className="hover:text-blue-600" onClick={toggleSidebar}>
            Profile
          </Link>
          <Link href="/login" className="hover:text-blue-600" onClick={toggleSidebar}>
            Login
          </Link>
          <Link href="/register" className="hover:text-blue-600" onClick={toggleSidebar}>
            Register
          </Link>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-40 z-30"
          onClick={toggleSidebar}
        />
      )}
    </nav>
  );
}
