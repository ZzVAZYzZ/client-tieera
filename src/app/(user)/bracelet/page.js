"use client";
import React from "react";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import { toIntegerVND } from "../utils/price";
import { useFetchProducts } from "../../../hook/useFetchProducts";
import useViewport from "../../../hook/useViewport";
import { useFavorites } from "../../../hook/useFavorites";

const parsePrice = toIntegerVND;

export default function Page() {
  const { products, loading: productsLoading, error } = useFetchProducts();
  const { favoriteIds, addFavorite, favoritesError } = useFavorites();

  const [priceRange, setPriceRange] = React.useState("");
  const [color, setColor] = React.useState("");
  const [material, setMaterial] = React.useState("");
  const [sortBy, setSortBy] = React.useState("");
  const { width } = useViewport();
  const isLaptop = width > 1024;
  const isTablet = width > 480 && width <= 1024;
  const isMobile = width <= 480;
  const [showFilter, setShowFilter] = React.useState(false);
  const displayedData = React.useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];

    // category filter for "vong tay"
    list = list.filter((item) => {
      const cat = item?.Category?.name || "";
      return String(cat).trim().toLowerCase() === "vong tay";
    });

    if (priceRange) {
      let min = 0,
        max = Infinity;
      if (priceRange.includes("-")) {
        const [minStr, maxStr] = priceRange.split("-");
        min = Number(minStr);
        max = Number(maxStr);
      } else {
        if (priceRange === "1") {
          min = 0;
          max = 20;
        } else if (priceRange === "2") {
          min = 20;
          max = 30;
        } else if (priceRange === "3") {
          min = 30;
          max = 40;
        } else if (priceRange === "4") {
          min = 40;
          max = 100;
        }
      }
      list = list.filter((item) => {
        const price = parsePrice(item.price);
        return price >= min * 1_000_000 && price <= max * 1_000_000;
      });
    }

    if (color) {
      let colorName = color;
      if (color === "5") colorName = "Vang";
      else if (color === "6") colorName = "Vang hong";
      else if (color === "7") colorName = "Trang";
      list = list.filter(
        (item) =>
          String(item.color).toLowerCase() === String(colorName).toLowerCase(),
      );
    }

    if (material) {
      let materialName = material;
      if (material === "8") materialName = "vang";
      else if (material === "9") materialName = "kim cuong";
      list = list.filter(
        (item) =>
          String(item.material).toLowerCase() ===
          String(materialName).toLowerCase(),
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

  const renderStatus = () => (
    <>
      {productsLoading && (
        <div className="p-4 text-sm text-gray-500">Đang tải sản phẩm...</div>
      )}
      {error && (
        <div className="p-4 text-sm text-red-500">
          lỗi tải dữ liệu: {String(error)}
        </div>
      )}
      {favoritesError && (
        <div className="p-4 text-sm text-red-500">
          Lỗi tải danh sách yêu thích: {String(favoritesError)}
        </div>
      )}
    </>
  );

  const handleFavoriteClick = async (productId) => {
    if (favoriteIds.includes(String(productId))) {
      alert("Sản phẩm đã có trong danh sách yêu thích");
      return;
    }

    try {
      await addFavorite(productId);
      alert("Đã thêm sản phẩm vào danh sách yêu thích");
    } catch (err) {
      if (err?.message === "Missing access token") return;
      alert(
        err?.message ||
          "Không thể thêm sản phẩm vào danh sách yêu thích lúc này",
      );
    }
  };

  // Handlers passed to child components
  const handlePriceChange = (value) => setPriceRange(value);
  const handleColorChange = (value) => setColor(value);
  const handleMaterialChange = (value) => setMaterial(value);
  const handleSortChange = (value) => setSortBy(value);

  return (
    <div className="flex flex-col items-center mt-6 lg:mt-10 px-4 lg:px-0">
      {/* TITLE */}
      <div className="w-full max-w-[1200px] mb-4">
        <p className="text-[22px] sm:text-[26px] lg:text-[32px] text-[#9B8D6F]">
          Vòng tay
        </p>
      </div>

      {/* MOBILE BUTTON (giống 3 page kia) */}
      <div className="w-full max-w-[1200px] mb-3 lg:hidden">
        <button
          onClick={() => setShowFilter(true)}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          Bộ lọc
        </button>
      </div>

      {/* MAIN */}
      <div className="w-full max-w-[1200px] flex gap-4 lg:gap-6 items-start">
        {/* ✅ FILTER DESKTOP */}
        <div className="hidden lg:block w-[260px] flex-shrink-0 border-r pr-4">
          <Filters
            priceRange={priceRange}
            color={color}
            material={material}
            sortBy={sortBy}
            onPriceRangeChange={handlePriceChange}
            onColorChange={handleColorChange}
            onMaterialChange={handleMaterialChange}
            onSortChange={handleSortChange}
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

      {/* 🔥 FILTER MOBILE DRAWER */}
      {showFilter && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowFilter(false)}
          />

          {/* panel */}
          <div className="fixed right-0 top-0 h-full w-[85%] sm:w-[380px] bg-white z-50 p-4 overflow-y-auto">
            <div className="flex justify-between mb-4">
              <p className="font-semibold">Bộ lọc</p>
              <button onClick={() => setShowFilter(false)}>✕</button>
            </div>

            <Filters
              priceRange={priceRange}
              color={color}
              material={material}
              sortBy={sortBy}
              onPriceRangeChange={handlePriceChange}
              onColorChange={handleColorChange}
              onMaterialChange={handleMaterialChange}
              onSortChange={handleSortChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
