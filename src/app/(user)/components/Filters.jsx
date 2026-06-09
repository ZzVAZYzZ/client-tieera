"use client";
import React from "react";

const Filters = ({
  priceRange,
  color,
  material,
  sortBy,
  onPriceRangeChange,
  onColorChange,
  onMaterialChange,
  onSortChange,
  className = "",
}) => {
  const containerClass = [
    "w-full lg:w-[260px] flex flex-col gap-4 bg-white",
    "border border-[#E5E5E5] rounded-lg p-4 shadow-sm",
    "max-h-[80vh] overflow-y-auto",
    "lg:max-h-none lg:overflow-visible", // 🔥 thêm dòng này
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const labelClass = "flex items-center gap-2 cursor-pointer";
  const textClass = "text-[13px] sm:text-[14px]";

  return (
    <div className={containerClass}>
      {/* TITLE */}
      <p className="text-[18px] sm:text-[20px] lg:text-[22px] font-semibold">
        Bộ lọc
      </p>

      <div className="flex flex-col gap-4" style={{ accentColor: "black" }}>
        {/* PRICE */}
        <div className="flex flex-col gap-2">
          <p className="text-[15px] sm:text-[16px] lg:text-[18px] font-medium">
            Theo giá
          </p>

          <label className={labelClass}>
            <input
              type="checkbox"
              checked={priceRange === "1"}
              onChange={(e) =>
                onPriceRangeChange?.(e.target.checked ? "1" : "")
              }
            />
            <p className={textClass}>Dưới 20 triệu</p>
          </label>

          <label className={labelClass}>
            <input
              type="checkbox"
              checked={priceRange === "2"}
              onChange={(e) =>
                onPriceRangeChange?.(e.target.checked ? "2" : "")
              }
            />
            <p className={textClass}>20 - 30 triệu</p>
          </label>

          <label className={labelClass}>
            <input
              type="checkbox"
              checked={priceRange === "3"}
              onChange={(e) =>
                onPriceRangeChange?.(e.target.checked ? "3" : "")
              }
            />
            <p className={textClass}>30 - 40 triệu</p>
          </label>

          <label className={labelClass}>
            <input
              type="checkbox"
              checked={priceRange === "4"}
              onChange={(e) =>
                onPriceRangeChange?.(e.target.checked ? "4" : "")
              }
            />
            <p className={textClass}>40 - 100 triệu</p>
          </label>
        </div>

        {/* COLOR */}
        <div className="flex flex-col gap-2">
          <p className="text-[15px] sm:text-[16px] lg:text-[18px] font-medium">
            Màu sắc
          </p>

          <label className={labelClass}>
            <input
              type="checkbox"
              checked={color === "5"}
              onChange={(e) => onColorChange?.(e.target.checked ? "5" : "")}
              className="appearance-none w-[14px] h-[14px] border-2 border-[#F1DC87] checked:bg-[#F1DC87]"
            />
            <p className={textClass}>Vàng</p>
          </label>

          <label className={labelClass}>
            <input
              type="checkbox"
              checked={color === "6"}
              onChange={(e) => onColorChange?.(e.target.checked ? "6" : "")}
              className="appearance-none w-[14px] h-[14px] border-2 border-[#F2BAA8] checked:bg-[#F2BAA8]"
            />
            <p className={textClass}>Vàng hồng</p>
          </label>

          <label className={labelClass}>
            <input
              type="checkbox"
              checked={color === "7"}
              onChange={(e) => onColorChange?.(e.target.checked ? "7" : "")}
              className="appearance-none w-[14px] h-[14px] border-2 border-[#D6D6D6] checked:bg-[#D6D6D6]"
            />
            <p className={textClass}>Trắng</p>
          </label>
        </div>

        {/* MATERIAL */}
        <div className="flex flex-col gap-2">
          <p className="text-[15px] sm:text-[16px] lg:text-[18px] font-medium">
            Chất liệu
          </p>

          <label className={labelClass}>
            <input
              type="checkbox"
              checked={material === "8"}
              onChange={(e) => onMaterialChange?.(e.target.checked ? "8" : "")}
            />
            <p className={textClass}>Vàng</p>
          </label>

          <label className={labelClass}>
            <input
              type="checkbox"
              checked={material === "9"}
              onChange={(e) => onMaterialChange?.(e.target.checked ? "9" : "")}
            />
            <p className={textClass}>Kim cương</p>
          </label>
        </div>
      </div>

      {/* SORT */}
      <div className="border-t border-[#E5E5E5] pt-3">
        <p className="text-[16px] sm:text-[18px] font-semibold mb-2">Sắp xếp</p>

        <div className="flex flex-col gap-2">
          {[
            { label: "Giá thấp → cao", value: "priceAsc" },
            { label: "Giá cao → thấp", value: "priceDesc" },
            { label: "Bán chạy", value: "bestSeller" },
            { label: "A-Z", value: "nameAsc" },
          ].map((item) => (
            <label key={item.value} className={labelClass}>
              <input
                type="checkbox"
                checked={sortBy === item.value}
                onChange={(e) =>
                  onSortChange?.(e.target.checked ? item.value : "")
                }
              />
              <p className={textClass}>{item.label}</p>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
