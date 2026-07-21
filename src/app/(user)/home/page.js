"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Picture from "../../../assets/images/NKC-2160X900-2-2048x853 1.png";
import nhan5 from "../../../assets/images/Rectangle 16.png";
import Arrow from "../../../assets/icons/arrow";
import { useFetchProducts } from "../../../hook/useFetchProducts";
import { toIntegerVND } from "../utils/price";
import useViewport from "../../../hook/useViewport";

export default function Page() {
  const router = useRouter();
  const { products } = useFetchProducts();
  const { width } = useViewport();
  const isLaptop = width > 1024;
  const isTablet = width > 480 && width <= 1024;
  const isMobile = width <= 480;
<<<<<<< HEAD
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const touchStartX = React.useRef(0);
=======

  useEffect(() => {
    console.log(products);
  }, [products]);
>>>>>>> 340173087d8917f22f1c39af073ed3a9f86b8c03

  React.useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const formatPriceVND = (input) =>
    new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
      toIntegerVND(input),
    );

  const getMainImage = (item) => {
    const imgs = Array.isArray(item?.ProductImages) ? item.ProductImages : [];
    const main = imgs.find((im) => im?.is_main) || imgs[0];
    return main?.image_url || null;
  };

  const goToProduct = (item) => {
    if (!item) return;
    const id = item?.product_id;
    const cat = String(item?.Category?.name || "")
      .trim()
      .toLowerCase();
    const map = {
      nhan: "ring",
      "bong tai": "earring",
      "day chuyen": "necklace",
      "vong tay": "bracelet",
    };
    const segment = map[cat] || "ring";
    if (id) router.push(`/${segment}/${id}`);
  };

  const newArrivals = React.useMemo(() => {
    const list = Array.isArray(products) ? [...products] : [];
    list.sort((a, b) => {
      const ta = Date.parse(a?.created_at || 0) || 0;
      const tb = Date.parse(b?.created_at || 0) || 0;
      if (tb !== ta) return tb - ta;
      const ida = Number(a?.product_id) || 0;
      const idb = Number(b?.product_id) || 0;
      return idb - ida;
    });
    return list.slice(0, 4);
  }, [products]);
<<<<<<< HEAD

  const next = () => {
    setCurrentIndex((prev) => (prev === newArrivals.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? newArrivals.length - 1 : prev - 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (diff > 50) next(); // vuốt trái
    if (diff < -50) prev(); // vuốt phải
  };
=======
  
>>>>>>> 340173087d8917f22f1c39af073ed3a9f86b8c03
  if (isLaptop) {
    return (
      <div className="flex flex-col justify-center items-center gap-[200px]">
        {/* banner */}
        <img src={Picture.src} alt="banner" className="w-full" />
        {/* Browse New Arrivals */}
        <div className="flex flex-col gap-[50px]">
          <a className="text-[40px] font-semibold">Browse New Arrivals</a>
          <div className="h-[400px] flex flex-row justify-around gap-5">
            {newArrivals.map((item) => (
              <div
                key={item.product_id}
                onClick={() => goToProduct(item)}
                className="w-[300px] flex flex-col gap-2.5 items-center border border-[#D6D6D6] hover:shadow-xl transition-shadow duration-300 rounded-md cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goToProduct(item);
                }}
              >
                <img
                  src={getMainImage(item)}
                  alt={item?.name}
                  className="w-[250px] h-[250px] mt-[18px] object-cover rounded"
                />
                <div className="w-full px-5 text-left h-[120px] flex flex-col justify-between">
                  <p className="text-[20px] font-medium">{item?.name}</p>
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
                        <span className="text-[16px] font-semibold text-[#9B8D6F]">
                          {formatPriceVND(finalPrice)} ₫
                        </span>
                        <span className="text-[14px] text-gray-400 line-through">
                          {formatPriceVND(priceInt)} ₫
                        </span>
                      </div>
                    ) : (
                      <div className="text-[16px] text-[#9B8D6F]">
                        {formatPriceVND(priceInt)} ₫
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Together Forever */}
        <div className="flex flex-col gap-[50px] mb-[200px]">
          <a className="text-[40px] font-semibold">Together Forever</a>
          <div className="h-[600px] flex flex-row justify-around gap-5">
            <img src={nhan5.src} alt="" />
            <div className="w-[600px] flex flex-col justify-between text-black">
              <a className=" text-[48px] font-bold">A</a>
              <a className=" text-[110px] font-extrabold text-[#A18B10]">
                LOVE
              </a>
              <a className=" text-[32px] font-bold">STORY WITHOUT LIMITS</a>
              <a className=" text-[32px] font-light my-2.5">
                Couple rings are more than jewelry — they symbolize “two hearts,
                one rhythm.” Each design is crafted with care to reflect your
                love and celebrate every precious moment together.
              </a>
              <button
                className="w-[200px] h-[50px] border-[5px] border-[#A18B10] rounded-[5px] flex flex-row items-center justify-center gap-2.5 cursor-pointer"
                onClick={() => {
                  router.push("/ring");
                }}
              >
                <p className=" text-[24px] font-thin">Shop now</p>
                <Arrow />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // TABLET: thu nhỏ từ laptop, 2 sp / hàng, font nhỏ hơn, giảm khoảng cách
  if (isTablet) {
    return (
      <div className="flex flex-col items-center gap-16 px-6 pb-16">
        {/* banner */}
        <img src={Picture.src} alt="banner" className="w-full" />

        {/* Browse New Arrivals */}
        <div className="flex flex-col gap-8 w-full max-w-5xl">
          <a className="text-[28px] font-semibold text-center">
            Browse New Arrivals
          </a>
          <div className="grid grid-cols-2 gap-5 justify-items-center">
            {newArrivals.map((item) => (
              <div
                key={item.product_id}
                onClick={() => goToProduct(item)}
                className="w-[220px] flex flex-col gap-2 items-center border border-[#D6D6D6] hover:shadow-lg transition-shadow duration-300 rounded-md cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goToProduct(item);
                }}
              >
                <img
                  src={getMainImage(item)}
                  alt={item?.name}
                  className="w-[200px] h-[200px] mt-3 object-cover rounded"
                />
                <div className="w-full px-4 pb-4 text-left flex flex-col gap-2">
                  <p className="text-[16px] font-medium line-clamp-2">
                    {item?.name}
                  </p>
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
                        <span className="text-[14px] font-semibold text-[#9B8D6F]">
                          {formatPriceVND(finalPrice)} ₫
                        </span>
                        <span className="text-[12px] text-gray-400 line-through">
                          {formatPriceVND(priceInt)} ₫
                        </span>
                      </div>
                    ) : (
                      <div className="text-[14px] text-[#9B8D6F]">
                        {formatPriceVND(priceInt)} ₫
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Together Forever */}
        <div className="flex flex-col gap-10 w-full max-w-5xl">
          <a className="text-[28px] font-semibold text-center">
            Together Forever
          </a>
          <div className="flex flex-row gap-6 items-center">
            <div className="flex-1 flex justify-center">
              <img
                src={nhan5.src}
                alt=""
                className="max-h-[380px] w-auto object-contain"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between text-black gap-3">
              <a className="text-[32px] font-bold">A</a>
<<<<<<< HEAD
              <a className="text-[64px] font-extrabold text-[#A18B10]">LOVE</a>
=======
              <a className="text-[64px] font-extrabold text-[#A18B10]">
                LOVE
              </a>
>>>>>>> 340173087d8917f22f1c39af073ed3a9f86b8c03
              <a className="text-[22px] font-bold">STORY WITHOUT LIMITS</a>
              <a className="text-[18px] font-light">
                Couple rings are more than jewelry — they symbolize “two hearts,
                one rhythm.” Each design is crafted with care to reflect your
                love and celebrate every precious moment together.
              </a>
              <button
                className="mt-4 w-[180px] h-11 border-4 border-[#A18B10] rounded-[5px] flex flex-row items-center justify-center gap-2 cursor-pointer"
                onClick={() => {
                  router.push("/ring");
                }}
              >
                <p className="text-[20px] font-thin">Shop now</p>
                <Arrow />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MOBILE: thu nhỏ hơn nữa, layout xếp dọc, full width
  if (isMobile) {
    return (
      <div className="flex flex-col items-center gap-10 px-4 pb-16">
        {/* banner */}
        <img src={Picture.src} alt="banner" className="w-full" />

        {/* Browse New Arrivals */}
        <div className="flex flex-col gap-6 w-full">
<<<<<<< HEAD
          <a className="text-[18px] font-semibold text-center">
            Browse New Arrivals
          </a>

          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-4 px-4">
              {newArrivals.map((item) => (
                <div
                  key={item.product_id}
                  onClick={() => goToProduct(item)}
                  className="min-w-[85%] flex-shrink-0 border rounded-xl overflow-hidden"
                >
                  <img
                    src={getMainImage(item)}
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-3">
                    <p className="text-[14px] font-medium line-clamp-2">
                      {item?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
=======
          <a className="text-[22px] font-semibold text-center">
            Browse New Arrivals
          </a>
          <div className="flex flex-col gap-5">
            {newArrivals.map((item) => (
              <div
                key={item.product_id}
                onClick={() => goToProduct(item)}
                className="w-full flex flex-col gap-2 border border-[#D6D6D6] hover:shadow-md transition-shadow duration-300 rounded-md cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goToProduct(item);
                }}
              >
                <img
                  src={getMainImage(item)}
                  alt={item?.name}
                  className="w-full h-56 mt-3 object-cover rounded-t-md"
                />
                <div className="w-full px-4 pb-4 text-left flex flex-col gap-2">
                  <p className="text-[15px] font-medium line-clamp-2">
                    {item?.name}
                  </p>
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
                        <span className="text-[14px] font-semibold text-[#9B8D6F]">
                          {formatPriceVND(finalPrice)} ₫
                        </span>
                        <span className="text-[12px] text-gray-400 line-through">
                          {formatPriceVND(priceInt)} ₫
                        </span>
                      </div>
                    ) : (
                      <div className="text-[14px] text-[#9B8D6F]">
                        {formatPriceVND(priceInt)} ₫
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
>>>>>>> 340173087d8917f22f1c39af073ed3a9f86b8c03
          </div>
        </div>

        {/* Together Forever */}
        <div className="flex flex-col gap-6 w-full">
          <a className="text-[22px] font-semibold text-center">
            Together Forever
          </a>
          <div className="flex flex-col gap-5 items-center">
            {/* Cho text trên, hình dưới để đọc dễ hơn */}
            <div className="flex flex-col text-black gap-2 text-center">
              <a className="text-[28px] font-bold leading-none">A</a>
              <a className="text-[40px] font-extrabold text-[#A18B10] leading-none">
                LOVE
              </a>
<<<<<<< HEAD
              <a className="text-[18px] font-bold mt-1">STORY WITHOUT LIMITS</a>
=======
              <a className="text-[18px] font-bold mt-1">
                STORY WITHOUT LIMITS
              </a>
>>>>>>> 340173087d8917f22f1c39af073ed3a9f86b8c03
              <a className="text-[14px] font-light mt-2">
                Couple rings are more than jewelry — they symbolize “two hearts,
                one rhythm.” Each design is crafted with care to reflect your
                love and celebrate every precious moment together.
              </a>
              <button
                className="mt-4 w-full h-11 border-[3px] border-[#A18B10] rounded-[5px] flex flex-row items-center justify-center gap-2 cursor-pointer"
                onClick={() => {
                  router.push("/ring");
                }}
              >
                <p className="text-[18px] font-thin">Shop now</p>
                <Arrow />
              </button>
            </div>
            <img
              src={nhan5.src}
              alt=""
              className="w-full max-h-72 object-contain"
            />
          </div>
        </div>
      </div>
    );
  }

  // fallback (trường hợp width không xác định)
  return null;
}
