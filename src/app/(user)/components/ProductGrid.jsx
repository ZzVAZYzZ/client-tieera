"use client";
import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, favorites, onToggleFavorite }) => {
  const count = Array.isArray(products) ? products.length : 0;

  const favoriteIds = React.useMemo(() => {
    if (!Array.isArray(favorites)) return [];
    return favorites.map((item) => String(item?.product_id ?? item));
  }, [favorites]);

  return (
    <div className="flex flex-col mb-10 gap-3 sm:gap-4 lg:gap-6">
      {/* TEXT */}
      <p className="text-[13px] sm:text-sm md:text-base text-gray-600">
        Hiện có <span className="font-medium">{count}</span> sản phẩm
      </p>

      {/* GRID */}
      <div
        className="
        grid 
        grid-cols-2 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-3 
        xl:grid-cols-4 
        gap-3 sm:gap-4 lg:gap-5
      "
      >
        {products?.map((item, index) => (
          <ProductCard
            key={item.product_id || index} // 🔥 fix key
            item={item}
            isFavorite={favoriteIds.includes(String(item.product_id))}
            onToggleFavorite={() => onToggleFavorite?.(item.product_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
