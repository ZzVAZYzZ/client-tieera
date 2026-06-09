"use client";
import React from "react";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import { toIntegerVND } from "../utils/price";
import { useFetchProducts } from "../../../hook/useFetchProducts";
import { useFavorites } from "../../../hook/useFavorites";

const parsePrice = toIntegerVND;

export default function Page() {
  const { products, loading: productsLoading, error } = useFetchProducts();
  const { favoriteIds, addFavorite, favoritesError } = useFavorites();

  // filter state
  const [priceRange, setPriceRange] = React.useState("");
  const [color, setColor] = React.useState("");
  const [material, setMaterial] = React.useState("");
  const [sortBy, setSortBy] = React.useState("");

  // 🔥 drawer state (GIỐNG EAR)
  const [showFilter, setShowFilter] = React.useState(false);

  // filter logic
  const displayedData = React.useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];

    // ✅ đổi sang "day chuyen"
    list = list.filter(
      (item) =>
        String(item?.Category?.name || "").toLowerCase() === "day chuyen",
    );

    if (priceRange) {
      let min = 0,
        max = Infinity;

      if (priceRange === "1") [min, max] = [0, 20];
      if (priceRange === "2") [min, max] = [20, 30];
      if (priceRange === "3") [min, max] = [30, 40];
      if (priceRange === "4") [min, max] = [40, 100];

      list = list.filter((item) => {
        const price = parsePrice(item.price);
        return price >= min * 1_000_000 && price <= max * 1_000_000;
      });
    }

    if (color) {
      const map = { 5: "vang", 6: "vang hong", 7: "trang" };
      list = list.filter(
        (item) => String(item.color).toLowerCase() === map[color],
      );
    }

    if (material) {
      const map = { 8: "vang", 9: "kim cuong" };
      list = list.filter(
        (item) => String(item.material).toLowerCase() === map[material],
      );
    }

    if (sortBy === "priceAsc") {
      list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortBy === "priceDesc") {
      list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortBy === "nameAsc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, priceRange, color, material, sortBy]);

  const handleFavoriteClick = async (productId) => {
    if (favoriteIds.includes(String(productId))) {
      alert("Đã có trong yêu thích");
      return;
    }
    await addFavorite(productId);
  };

  const renderStatus = () => (
    <>
      {productsLoading && <p className="text-sm text-gray-500">Đang tải...</p>}
      {error && <p className="text-red-500">Lỗi dữ liệu</p>}
      {favoritesError && <p className="text-red-500">Lỗi yêu thích</p>}
    </>
  );

  return (
    <div className="flex flex-col items-center mt-6 lg:mt-10 px-4 lg:px-0">
      {/* TITLE */}
      <div className="w-full max-w-[1200px] mb-4">
        <p className="text-[22px] sm:text-[26px] lg:text-[32px] text-[#9B8D6F]">
          Dây chuyền
        </p>
      </div>

      {/* ✅ ACTION BAR (mobile giống ear) */}
      <div className="w-full max-w-[1200px] mb-3 lg:hidden">
        <button
          onClick={() => setShowFilter(true)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          Bộ lọc
        </button>
      </div>

      <div className="w-full max-w-[1200px] flex gap-6">
        {/* ✅ DESKTOP FILTER */}
        <div className="hidden lg:block">
          <Filters
            priceRange={priceRange}
            color={color}
            material={material}
            sortBy={sortBy}
            onPriceRangeChange={setPriceRange}
            onColorChange={setColor}
            onMaterialChange={setMaterial}
            onSortChange={setSortBy}
            className="lg:sticky lg:top-6 self-start"
          />
        </div>

        {/* PRODUCT */}
        <div className="flex-1">
          {renderStatus()}
          <ProductGrid
            products={displayedData}
            favorites={favoriteIds}
            onToggleFavorite={handleFavoriteClick}
          />
        </div>
      </div>

      {/* ✅ DRAWER FILTER (GIỐNG EAR 100%) */}
      {showFilter && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowFilter(false)}
          />

          {/* panel */}
          <div
            className="
              fixed right-0 top-0 h-full
              w-[85%] sm:w-[380px]
              bg-white z-50 p-4
              overflow-y-auto
            "
          >
            <div className="flex justify-between mb-4">
              <p className="font-semibold">Bộ lọc</p>
              <button onClick={() => setShowFilter(false)}>✕</button>
            </div>

            <Filters
              priceRange={priceRange}
              color={color}
              material={material}
              sortBy={sortBy}
              onPriceRangeChange={setPriceRange}
              onColorChange={setColor}
              onMaterialChange={setMaterial}
              onSortChange={setSortBy}
            />
          </div>
        </>
      )}
    </div>
  );
}
