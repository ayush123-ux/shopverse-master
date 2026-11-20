"use client";

import API from "@/lib/axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

type User = {
  name?: string;
  role: "Customer" | "admin" | "Seller";
};

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const syncAuth = () => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (t && t !== "undefined" && t !== "null") {
      setToken(t);
    } else {
      setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    syncAuth();

    const handleStorageChange = () => syncAuth();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
    };
  }, [pathname]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const fetchUser = async () => {
    try {
      const res = await API.get<User>("user/profile");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
    router.refresh();
    router.push("/");
  };

  const CATEGORIES = [
    { label: "Men", value: "mens" },
    { label: "Women", value: "females" },
    { label: "Kids & Toys", value: "kids" },
    { label: "Home & Kitchen", value: "home" },
    { label: "Beauty & Health", value: "beauty" },
    { label: "Accessories", value: "access" },
    { label: "Bags", value: "bags" },
  ];

  return (
   <nav className="bg-[#0f0f0f] text-white border-b border-[#2a2a2a]">

  <div className="flex items-center justify-between px-8 py-4">

    {/* LEFT SIDE */}
    <div className="flex items-center gap-8">
      <Link href="/" className="text-xl font-bold text-[#d4a373] tracking-wide">
        ShopVerse
      </Link>

      <Link href="/" className="hover:text-[#d4a373] transition">Home</Link>
      <Link href="/about" className="hover:text-[#d4a373] transition">About</Link>
      <Link href="/products" className="hover:text-[#d4a373] transition">Products</Link>
    </div>

    {/* SEARCH */}
    <form onSubmit={handleSearch} className="flex">
      <input
        type="text"
        placeholder="Search Products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 bg-[#1a1a1a] border border-[#333] 
        rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
        suppressHydrationWarning
      />
      <button
        type="submit"
        className="px-4 bg-gradient-to-r from-[#8b5e3c] to-[#d4a373]
        text-black rounded-r-lg font-medium hover:opacity-90 transition"
        suppressHydrationWarning
      >
        Search
      </button>
    </form>

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-6">

      <Link href="/cart" className="hover:text-[#d4a373] transition flex items-center gap-1 font-medium">
        Cart
      </Link>

      {!token ? (
        <>
          <Link href="/login" className="hover:text-[#d4a373]">Login</Link>
          <Link href="/signup" className="hover:text-[#d4a373]">Signup</Link>
        </>
      ) : (
        <>
          {/* PROFILE DROPDOWN */}
          <div className="relative group">
            <button className="hover:text-[#d4a373] flex items-center gap-1">
              {user?.name ? `${user.name} ▾` : "Account ▾"}
            </button>

            <div className="absolute right-0 mt-2 w-52 bg-[#1a1a1a]
              border border-[#333] rounded-xl shadow-xl
              opacity-0 invisible group-hover:opacity-100 
              group-hover:visible transition-all duration-200 z-50">

              <Link href="/profile"
                className="block px-4 py-2 hover:bg-[#2a2a2a]">
                My Profile
              </Link>

              <Link href="/profile/update"
                className="block px-4 py-2 hover:bg-[#2a2a2a]">
                Update Profile
              </Link>

              <Link href="/profile/password"
                className="block px-4 py-2 hover:bg-[#2a2a2a]">
                Change Password
              </Link>

              <Link href="/myorders"
                className="block px-4 py-2 hover:bg-[#2a2a2a]">
                My Orders
              </Link>

              <Link href="/cart"
                className="block px-4 py-2 hover:bg-[#2a2a2a]">
                My Cart
              </Link>

              {/* ADDRESS DROPDOWN INSIDE */}
              <div className="relative group/address">

                <button className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a]">
                  Address ▸
                </button>

                <div className="absolute left-full top-0 w-44 bg-[#1a1a1a]
                  border border-[#333] rounded-xl shadow-xl
                  opacity-0 invisible group-hover/address:opacity-100 
                  group-hover/address:visible transition">

                  <Link href="/address"
                    className="block px-4 py-2 hover:bg-[#2a2a2a]">
                    Add Address
                  </Link>

                  <Link href="/address/list"
                    className="block px-4 py-2 hover:bg-[#2a2a2a]">
                    My Addresses
                  </Link>

                </div>
              </div>

              {(user?.role === "admin" || user?.role === "Seller") && (
                <>
                  <div className="border-t border-[#333] my-1"></div>
                  <Link href="/dashboard"
                    className="block px-4 py-2 hover:bg-[#2a2a2a] text-[#d4a373]">
                    Dashboard
                  </Link>

                  <Link href="/orders"
                    className="block px-4 py-2 hover:bg-[#2a2a2a]">
                    Manage Orders
                  </Link>

                  <Link href="/add"
                    className="block px-4 py-2 hover:bg-[#2a2a2a]">
                    Add Products
                  </Link>
                </>
              )}

              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-[#2a2a2a] border-t border-[#333]"
              >
                Logout
              </button>

            </div>
          </div>
        </>
      )}
    </div>
  </div>

  {/* CATEGORY BAR */}
  <div className="flex gap-6 px-8 py-3 border-t border-[#2a2a2a] text-sm font-medium overflow-x-auto">

    {CATEGORIES.map((cat) => (
      <Link
        key={cat.value}
        href={`/products?category=${cat.value}`}
        className="hover:text-[#d4a373] transition whitespace-nowrap"
      >
        {cat.label}
      </Link>
    ))}

  </div>

</nav>

  );
}
