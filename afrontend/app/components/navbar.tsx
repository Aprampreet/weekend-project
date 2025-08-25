"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    ...(!isLoggedIn
      ? [
          { href: "/login", label: "Login" },
          { href: "/register", label: "Register" },
        ]
      : []),
  ];

  const accountLinks = [
    { href: "/profile", label: "Profile" },
    { href: "/billing", label: "Billing" },
    { href: "/team", label: "Team" },
    { href: "/subscription", label: "Subscription" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="bg-black/90 backdrop-blur-sm shadow-[0_1px_0_0_rgba(255,255,255,0.1)] fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
         <Link
  href="/"
className="text-3xl font-extrabold text-transparent bg-gradient-to-r bg-gradient-to-r from-purple-800 via-pink-600 to-fuchsia-700
 bg-clip-text drop-shadow-md"
>
  ARZONA
</Link>




          <div className="hidden md:flex items-center ml-auto space-x-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  pathname === href
                    ? "bg-neutral-900 text-white shadow-md"
                    : "text-gray-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}

            {isLoggedIn && (
              <div className="relative group">
                <button className="px-4 py-2 rounded-md text-gray-300 hover:text-white hover:bg-neutral-800 transition flex items-center gap-1">
                  Account <ChevronDown size={16} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-neutral-800 rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50">
                  {accountLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="block px-4 py-2 text-gray-300 hover:bg-neutral-800 hover:text-white transition-all"
                    >
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-neutral-800 hover:text-white transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-neutral-800 text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black/95 backdrop-blur-sm shadow-xl transform transition-transform duration-500 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-neutral-800">
          <span className="text-lg font-bold text-blue-500">MyApp</span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col p-6 space-y-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`px-4 py-2 rounded-md text-center transition-all duration-300 ${
                pathname === href
                  ? "bg-neutral-900 text-white shadow-md"
                  : "text-gray-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}

          {isLoggedIn && (
            <div className="border-t border-neutral-800 pt-4 space-y-2">
              {accountLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 rounded-md text-center text-gray-400 hover:bg-neutral-800 hover:text-white transition-all"
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-center px-4 py-2 rounded-md text-gray-400 hover:bg-neutral-800 hover:text-white transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
}
