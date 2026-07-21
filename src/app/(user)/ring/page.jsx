"use client";
import React from "react";
import Filters from "../components/Filters";
import ProductGrid from "../components/ProductGrid";
import { toIntegerVND } from "../utils/price";
import { useFetchProducts } from "../../../hook/useFetchProducts";
import useViewport from "../../../hook/useViewport";
import { useFavorites } from "../../../hook/useFavorites";

const parsePrice = toIntegerVND;

const Page = () => {
  const { products, loading: productsLoading, error } = useFetchProducts();
  const { favoriteIds, addFavorite, favoritesError } = useFavorites();

  // Filter & sort state
  const [priceRange, setPriceRange] = React.useState("");
  const [color, setColor] = React.useState("");
  const [material, setMaterial] = React.useState("");
  const [sortBy, setSortBy] = React.useState("");

  const { width } = useViewport();
  const isLaptop = width > 1024;
  const isTablet = width > 480 && width <= 1024;
  const isMobile = width <= 480;

  // danh sAA-ch «`ƒ?TA,AÿA_"c lAÿA_?c + sAÿA_p xAÿAA"p
  const displayedData = React.useMemo(() => {
    let list = Array.isArray(products) ? [...products] : [];

    list = list.filter((item) => {
      const cat = item?.Category?.name || "";
      return String(cat).trim().toLowerCase() === "nhan";
    });

    // phAÿAA-m vi lAÿA_?c theo giAA-
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

    // lAÿA_?c theo mAA¨u
    if (color) {
      let colorName = color;
      if (color === "5") colorName = "Vang";
      else if (color === "6") colorName = "Vang hong";
      else if (color === "7") colorName = "Trang";
      list = list.filter(
        (item) =>
<<<<<<< HEAD
          String(item.color).toLowerCase() === String(colorName).toLowerCase(),
=======
          String(item.color).toLowerCase() === String(colorName).toLowerCase()
>>>>>>> 340173087d8917f22f1c39af073ed3a9f86b8c03
      );
    }

    // lAÿA_?c theo chAÿAA?t liAÿA_A~u
    if (material) {
      let materialName = material;
      if (material === "8") materialName = "vang";
      else if (material === "9") materialName = "kim cuong";
      list = list.filter(
        (item) =>
          String(item.material).toLowerCase() ===
<<<<<<< HEAD
          String(materialName).toLowerCase(),
=======
          String(materialName).toLowerCase()
>>>>>>> 340173087d8917f22f1c39af073ed3a9f86b8c03
      );
    }

    // sAÿA_p xAAÝp
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
      {/* {error && <div className="p-4 text-sm text-red-500">lỗi tải dữ liệu</div>}
      {favoritesError && (
        <div className="p-4 text-sm text-red-500">
          Lỗi tải danh sách yêu thích
        </div>
      )} */}
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

  if (isLaptop) {
    return (
      <div className="flex flex-col items-center gap-10 mt-10">
        <div className="w-[90%]">
          <p className="text-[32px] text-[#9B8D6F] text-left">Nhẫn</p>
        </div>
        <div className="w-[90%] flex flex-row gap-8 xl:gap-[50px]">
          <Filters
            priceRange={priceRange}
            color={color}
            material={material}
            sortBy={sortBy}
            onPriceRangeChange={handlePriceChange}
            onColorChange={handleColorChange}
            onMaterialChange={handleMaterialChange}
            onSortChange={handleSortChange}
            className="lg:sticky lg:top-6 self-start"
          />

          <div className="flex-1">
            {renderStatus()}
            <ProductGrid
              products={displayedData}
              favorites={favoriteIds}
              onToggleFavorite={handleFavoriteClick}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className="flex flex-col items-center gap-8 px-6 pb-14 pt-8">
        <div className="w-full max-w-5xl">
          <p className="text-[28px] text-[#9B8D6F] text-left">Nhẫn</p>
        </div>
        <div className="w-full max-w-5xl flex flex-col gap-6">
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

          <div className="flex-1">
            {renderStatus()}
            <ProductGrid
              products={displayedData}
              favorites={favoriteIds}
              onToggleFavorite={handleFavoriteClick}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col gap-6 px-4 pb-14 pt-6">
        <p className="text-[22px] text-[#9B8D6F] text-left">Nhẫn</p>

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

        <div className="flex-1">
          {renderStatus()}
          <ProductGrid
            products={displayedData}
            favorites={favoriteIds}
            onToggleFavorite={handleFavoriteClick}
          />
        </div>
      </div>
    );
  }

  // fallback
  return null;
};

export default Page;
