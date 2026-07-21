"use client";
import React from "react";
import HeartIcon from "../../../assets/icons/heart_icon";
import { toIntegerVND } from "../utils/price";
import { useRouter } from "next/navigation";

const formatPriceVND = (input) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
    toIntegerVND(input)
  );

const ProductCard = ({ item, isFavorite, onToggleFavorite }) => {
  const router = useRouter();

  const goToDetail = () => {
    const id = item?.product_id;
    const cat = String(item?.Category?.name || "").trim().toLowerCase();
    if (!id) return;
    const map = {
      nhan: "ring",
      "bong tai": "earring",
      "day chuyen": "necklace",
      "vong tay": "bracelet",
    };
    const segment = map[cat] || "ring";
    router.push(`/${segment}/${id}`);
  };

  const images = Array.isArray(item?.ProductImages) ? item.ProductImages : [];
  const mainImage = images.find((img) => img?.is_main) || images[0];

  return (
    <div
      className="relative w-full h-full flex flex-col border border-[#D6D6D6] hover:shadow-xl transition-shadow duration-300 rounded-md cursor-pointer bg-white"
      onClick={goToDetail}
    >
      <div className="w-full aspect-4/5 overflow-hidden rounded-t-md bg-white">
        {mainImage?.image_url ? (
          <img
            src={mainImage.image_url}
            alt={item?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            Không có hình ảnh
          </div>
        )}
      </div>
      <div className="flex-1 w-full px-4 py-3 flex flex-col gap-2">
        <div className="text-base sm:text-lg font-medium leading-snug line-clamp-2">
          {item?.name}
        </div>
        <div className="mt-auto">
          {(() => {
            const priceInt = toIntegerVND(item?.price);
            const discountInt = toIntegerVND(item?.discount_price);
            const hasDiscount =
              Number.isFinite(priceInt) &&
              Number.isFinite(discountInt) &&
              discountInt > 0 &&
              discountInt < priceInt;
            const finalPrice = hasDiscount
              ? Math.max(priceInt - discountInt, 0)
              : priceInt;
            return hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="text-[15px] sm:text-[16px] font-semibold text-[#9B8D6F]">
                  {formatPriceVND(finalPrice)} đ
                </span>
                <span className="text-[13px] sm:text-[14px] text-gray-400 line-through">
                  {formatPriceVND(priceInt)} đ
                </span>
              </div>
            ) : (
              <div className="text-[15px] sm:text-[16px] text-[#9B8D6F]">
                {formatPriceVND(priceInt)} đ
              </div>
            );
          })()}
        </div>
      </div>
      <button
        type="button"
        aria-label="YAжu thA-ch"
        className="absolute top-3 right-3"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite?.();
        }}
      >
        <HeartIcon isFavorite={isFavorite} onClick={() => {}} />
      </button>
    </div>
  );
};

export default ProductCard;
