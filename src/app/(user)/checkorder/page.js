"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import orderLogo from "../../../assets/images/orderlogo.png";
import { useOrderTracking } from "../../../hook/useOrderTracking";
import OrderDetailsCard from "./components/OrderDetailsCard";

const OrderLookupPage = () => {
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  const {
    data: orderData,
    isLoading,
    error,
    lookup,
    reset,
  } = useOrderTracking();

  const handleSearch = () => {
    if (!isLoading && orderId.trim()) {
      reset();
      lookup(orderId.trim());
    }
  };

  const handleGoBack = () => {
    if (orderData && !error) {
      reset();
    } else {
      reset();
      router.back();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  bg-[#fcfbf9] px-4 py-15 md:py-16">
      {/* TITLE */}
      <h1 className="flex items-center text-lg sm:text-2xl md:text-3xl font-light text-[#333] mb-8 md:mb-12 uppercase tracking-wider text-center">
        TRA CỨU ĐƠN HÀNG
        <span className="ml-2">
          <Search
            size={28}
            className="text-[#9B8D6F] md:w-[40px] md:h-[40px]"
          />
        </span>
      </h1>

      {orderData && !error ? (
        // RESULT
        <div className="w-full max-w-4xl">
          <OrderDetailsCard order={orderData} />

          <div className="flex justify-center mt-6">
            <button
              onClick={handleGoBack}
              className="w-full sm:w-auto px-6 py-3 text-sm md:text-base font-semibold uppercase text-[#9B8D6F] border border-[#C0C0C0] rounded-lg hover:bg-[#f3f0eb]"
            >
              TRỞ VỀ / TRA CỨU KHÁC
            </button>
          </div>
        </div>
      ) : (
        // FORM
        <div
          className="
                    flex flex-col md:flex-row 
                    w-full max-w-4xl 
                    bg-white 
                    p-4 sm:p-6 md:p-10 
                    rounded-lg shadow-md
                "
        >
          {/* IMAGE */}
          <div className="w-full md:w-2/3 flex items-center justify-center mb-6 md:mb-0">
            <Image
              src={orderLogo}
              alt="order logo"
              className="w-[200px] sm:w-[300px] md:w-[400px] h-auto object-contain"
            />
          </div>

          {/* FORM */}
          <div className="w-full md:w-1/3 flex flex-col justify-center">
            <input
              type="text"
              placeholder="Nhập ID đơn hàng"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-3 mb-4 text-sm border border-[#C0C0C0] rounded-lg outline-none focus:ring-1 focus:ring-[#9B8D6F]"
            />

            {error && (
              <p className="text-red-500 text-xs mb-2 text-center">{error}</p>
            )}

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={`w-full px-4 py-3 mb-3 text-sm font-semibold text-white uppercase rounded-lg
                                ${
                                  isLoading
                                    ? "bg-gray-400"
                                    : "bg-[#9B8D6F] hover:bg-[#8e826b]"
                                }`}
            >
              {isLoading ? "ĐANG TRA..." : "TRA CỨU"}
            </button>

            <button
              onClick={handleGoBack}
              className="w-full px-4 py-3 text-sm font-semibold uppercase text-[#9B8D6F] border border-[#C0C0C0] rounded-lg hover:bg-[#f3f0eb]"
            >
              TRỞ VỀ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderLookupPage;