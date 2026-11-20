"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const TYPES_BY_CATEGORY: Record<string, string[]> = {
  mens: ["shirt", "pant", "suit", "jeans"],
  females: ["saree", "top", "dress"],
  beauty: ["facewash", "cream", "serum"],
  access: ["watch", "belt"],
  kids: ["toys", "kids-shirt"],
  bags: ["handbag", "backpack"],
  home: ["appliances", "furniture", "decor"],
};

function TypeSelectorInner() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const type = searchParams.get("type");

  if (!category) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">No category selected.</p>
      </div>
    );
  }

  if (category && !type) {
    const types = TYPES_BY_CATEGORY[category] || [];

    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 capitalize text-[#d4a373]">
            Select {category} type
          </h2>

          {types.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <p>No types available for this category.</p>
              <Link
                href={`/products?category=${category}`}
                className="mt-4 inline-block px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#8b5e3c] to-[#d4a373] text-black"
              >
                Browse All {category}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {types.map((t) => (
                <Link
                  key={t}
                  href={`/products?category=${category}&type=${t}`}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-2xl text-center hover:shadow-[#d4a373]/20 hover:border-[#d4a373] transition duration-300 text-gray-300 hover:text-[#d4a373]"
                >
                  {t.toUpperCase()}
                </Link>
              ))}
              <Link
                href={`/products?category=${category}`}
                className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-2xl text-center hover:shadow-[#d4a373]/20 hover:border-[#d4a373] transition duration-300 text-gray-300 hover:text-[#d4a373]"
              >
                ALL
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default function TypeSelector() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    }>
      <TypeSelectorInner />
    </Suspense>
  );
}
