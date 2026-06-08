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
    <div className="flex flex-col mb-10 gap-4 md:gap-6">
      <p className="text-sm sm:text-base text-gray-700">
        Hiện có {count} sản phẩm
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {products?.map((item, index) => (
          <ProductCard
            key={index}
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

