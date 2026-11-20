"use client";

import API from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Product = {
  _id: string;
  title: string;
  price: number;
  image: string;

  category: string;
  type: string;
  brand: string;
  fabric: string;
  size: string;
  color: string;
  gender: string;
  skinType: string;
};

function ProductsInner() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(1);  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ CLEAN FILTER STATE
  const [filters, setFilters] = useState({
    fabric: "",
    size: "",
    color: "",
    brand: "",
    gender: "",
    skinType: "",
    minPrice: "",
    maxPrice: "",
  });

  // ✅ FILTER CONFIG (TYPE BASED)

  const FILTERS_BY_CATEGORY: Record<string, string[]> = { 
    mens: ["shirt", "pant", "suit", "jeans", "watch"],
    females: ["suit", "saree", "top", "dress", "watch"],
    beauty: ["cream", "facewash", "serum"],
    access: ["headph", "watch", "belt"],
    kids: ["shirt", "pant", "suit", "top", "toys"],
    home: ["watch", "decor"],
    bags: ["bag", "backpack", "handbag"],
  };

  const FILTERS_BY_TYPE: Record<string, string[]> = {
    shirt: ["fabric", "size", "color", "brand", "gender"],
    pant: ["size", "color", "gender"],
    suit: ["fabric", "size", "color"],
    saree: ["fabric", "color"],
    top: ["fabric", "size", "color"],
    dress: ["color", "size"],
    jeans: ["size", "color"],
    watch: ["brand", "gender"],
    cream: ["brand", "skinType"],
    facewash: ["brand", "skinType"],
    serum: ["brand", "skinType"],
    headph: ["brand", "color"],
    belt: ["color"],
    toys: ["color"],
    decor: ["color"],
    bag: ["color"],
    backpack: ["color"],
    handbag: ["color"],
  };
  const BRAND_OPTIONS: Record<string, string[]> = {
    shirt: ["Gucci", "Armani"],
    pant: ["Armani"],
    suit: ["Gucci", "Armani"],
    jeans: ["Armani"],
    watch: ["Rolex", "Titan"],
    cream: ["MamaEarth", "Sugar", "Nivea"],
    facewash: ["MamaEarth", "Lakme"],
    serum: ["Sugar"],
    headph: ["Sony", "Boat"],
    belt: ["Armani"],
  };
  

  // ✅ FETCH PRODUCTS (category + type + filters)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/product/list", {
        params: {
          category,
          type,
          ...filters,
          search,
          page,
          limit: 12,
        },
      });

      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (res.data && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load products. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Sync state when URL search params change (e.g. navbar category links)
  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setType(searchParams.get("type") || "");
    setSearch(searchParams.get("search") || "");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
      fetchProducts();
  }, [category, type, filters, search, page]);

  const filtertype = FILTERS_BY_CATEGORY[category || ""] || [];

  let filtersToShow: string[] = [];
  if(!type){
    filtersToShow = [
      "fabric",
      "size",
      "color",
      "brand",
      "gender",
      "skinType",
    ];
  }
  else{
    filtersToShow = FILTERS_BY_TYPE[type || ""] || [];
  }

  return (
  <div className="min-h-screen bg-[#0f0f0f] text-white px-6 py-8">

    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

      {/* FILTER SIDEBAR */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] 
        rounded-2xl p-6 space-y-6 shadow-xl">

        <h2 className="text-xl font-bold text-[#d4a373]">
          Filters
        </h2>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[#111]
          border border-[#333] focus:ring-2 focus:ring-[#d4a373]"
        >
          <option value="">All Categories</option>
          <option value="mens">Mens</option>
          <option value="beauty">Beauty</option>
          <option value="access">Accessories</option>
          <option value="kids">Kids & Toys</option>
          <option value="home">Home & Kitchen</option>
          <option value="females">Female</option>
          <option value="bags">Bags</option>
        </select>

   
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[#111]
          border border-[#333] focus:ring-2 focus:ring-[#d4a373]"
        >
          <option value="">All Types</option>
          {filtertype.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>

        <div className="space-y-4">
          {filtersToShow.includes("fabric") && (
            <select
              onChange={(e) =>
                setFilters({ ...filters, fabric: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#111]
              border border-[#333] focus:ring-2 focus:ring-[#d4a373]"
            >
              <option value="">Fabric</option>
              <option value="cotton">Cotton</option>
              <option value="linen">Linen</option>
            </select>
          )}

          {filtersToShow.includes("size") && (
            <select
              onChange={(e) =>
                setFilters({ ...filters, size: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#111]
              border border-[#333] focus:ring-2 focus:ring-[#d4a373]"
            >
              <option value="">Size</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
            </select>
          )}

          {filtersToShow.includes("color") && (
            <select
              onChange={(e) =>
                setFilters({ ...filters, color: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#111]
              border border-[#333] focus:ring-2 focus:ring-[#d4a373]"
            >
              <option value="">Color</option>
              <option value="red">Red</option>
              <option value="black">Black</option>
            </select>
          )}

          {filtersToShow.includes("brand") && (
            <select
              onChange={(e) =>
                setFilters({ ...filters, brand: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#111]
              border border-[#333] focus:ring-2 focus:ring-[#d4a373]"
            >
              <option value="">Brand</option>
              {BRAND_OPTIONS[type!]?.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          )}

          {filtersToShow.includes("gender") && (
            <select
              onChange={(e) =>
                setFilters({ ...filters, gender: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#111]
              border border-[#333] focus:ring-2 focus:ring-[#d4a373]"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          )}

          {filtersToShow.includes("skinType") && (
            <select
              onChange={(e) =>
                setFilters({ ...filters, skinType: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-[#111]
              border border-[#333] focus:ring-2 focus:ring-[#d4a373]"
            >
              <option value="">Skin Type</option>
              <option value="oily">Oily</option>
              <option value="dry">Dry</option>
            </select>
          )}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="md:col-span-3">

        {loading ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-lg">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-20 space-y-4">
            <p className="text-lg font-semibold">{error}</p>
            <button
              onClick={() => fetchProducts()}
              className="px-6 py-2 rounded-lg bg-[#1a1a1a] border border-[#333] hover:bg-[#2a2a2a] text-white transition"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <Link
                key={p._id}
                href={`/product/${p._id}`}
                className="bg-[#1a1a1a] border border-[#2a2a2a]
                rounded-2xl overflow-hidden shadow-lg
                hover:shadow-[#d4a373]/20 hover:scale-105
                transition duration-300"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">
                  <p className="font-semibold text-gray-200 line-clamp-2">
                    {p.title}
                  </p>
                  <p className="mt-2 text-[#d4a373] font-bold text-lg">
                    ₹{p.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center gap-6 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-6 py-2 rounded-lg bg-[#1a1a1a]
            border border-[#333] hover:bg-[#2a2a2a]
            disabled:opacity-40"
          >
            Prev
          </button>

          <button
            onClick={() => setPage(page + 1)}
            className="px-6 py-2 rounded-lg bg-gradient-to-r
            from-[#8b5e3c] to-[#d4a373] text-black"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  </div>
);

}

export default function Products() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <p className="text-gray-400">Loading products...</p>
      </div>
    }>
      <ProductsInner />
    </Suspense>
  );
}
