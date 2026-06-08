"use client";
import React from "react";
import ProductGrid from "../components/ProductGrid";
import { useFavorites } from "../../../hook/useFavorites";
import { useFetchProducts } from "../../../hook/useFetchProducts";
import useViewport from "../../../hook/useViewport";

const Page = () => {
  const {
    favorites,
    favoriteIds,
    favoritesStatus,
    favoritesError,
    removeFavorite,
  } = useFavorites();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useFetchProducts();
  const { width } = useViewport();

  const isLaptop = width > 1024;
  const isTablet = width > 480 && width <= 1024;
  const isMobile = width <= 480;

  const favoriteProducts = React.useMemo(() => {
    const ids = favoriteIds.map(String);
    const productMap = new Map(
      (products || []).map((item) => [String(item.product_id), item]),
    );

    return ids
      .map(
        (id) =>
          productMap.get(id) ||
          favorites.find((f) => String(f.product_id) === id),
      )
      .filter(Boolean);
  }, [favoriteIds, favorites, products]);

  const renderStatus = () => (
    <>
      {(productsLoading || favoritesStatus === "loading") && (
        <div className="p-4 text-sm text-gray-500">Đang tải sản phẩm...</div>
      )}
      {/* {productsError && (
        <div className="p-4 text-sm text-red-500">Lỗi tải dữ liệu:</div>
      )}
      {favoritesError && (
        <div className="p-4 text-sm text-red-500">
          Lỗi tải danh sách yêu thích:
        </div>
      )} */}
      {favoriteProducts.length === 0 &&
        favoritesStatus !== "loading" &&
        !productsLoading && (
          <div className="p-4 text-sm text-gray-600">
            Danh sách yêu thích đang trống. Hãy thêm sản phẩm ở trang danh mục!
          </div>
        )}
    </>
  );

  const handleUnfavorite = async (productId) => {
    if (!favoriteIds.includes(String(productId))) return;

    try {
      await removeFavorite(productId);
      alert("Đã xóa sản phẩm khỏi danh sách yêu thích");
    } catch (err) {
      if (err?.message === "Missing access token") return;
      alert(err?.message || "Không thể bỏ yêu thích sản phẩm lúc này");
    }
  };

  const content = (
    <div className="flex-1">
      {renderStatus()}
      <ProductGrid
        products={favoriteProducts}
        favorites={favoriteIds}
        onToggleFavorite={handleUnfavorite}
      />
    </div>
  );

  if (isLaptop) {
    return (
      <div className="flex flex-col items-center gap-10 mt-10">
        <div className="w-[90%]">
          <p className="text-[32px] text-[#9B8D6F] text-left">
            Danh sách yêu thích
          </p>
        </div>
        <div className="w-[90%]">{content}</div>
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className="flex flex-col items-center gap-8 px-6 pb-14 pt-8">
        <div className="w-full max-w-5xl">
          <p className="text-[28px] text-[#9B8D6F] text-left">
            Danh sách yêu thích
          </p>
        </div>
        <div className="w-full max-w-5xl">{content}</div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col gap-6 px-4 pb-14 pt-6">
        <p className="text-[22px] text-[#9B8D6F] text-left">
          Danh sách yêu thích
        </p>
        {content}
      </div>
    );
  }

  return null;
};

export default Page;
