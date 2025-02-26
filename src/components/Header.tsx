"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase"; // Import your Firebase auth directly

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Use the imported auth instance directly
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="fixed w-full z-50 bg-black/30 backdrop-blur-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Tambola
          </div>
          <div className="hidden md:flex space-x-8">
            <Link
              href="#features"
              className="hover:text-purple-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#download"
              className="hover:text-purple-400 transition-colors"
            >
              Download
            </Link>
            <Link
              href="#about"
              className="hover:text-purple-400 transition-colors"
            >
              About
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="h-10 w-24 bg-gray-700/50 animate-pulse rounded-full"></div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <button className="bg-indigo-600 px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors">
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full hover:scale-105 transition-transform"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button className=" bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full hover:scale-105 transition-transform hidden">
                  Login
                </button>
              </Link>
            )}
            <a href="https://apps.apple.com/us/app/tibetan-calendar-app/id6741181925?platform=iphone">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full hover:scale-105 transition-transform">
                Play Now
              </button>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
