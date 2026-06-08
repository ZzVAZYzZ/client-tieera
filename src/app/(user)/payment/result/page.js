"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function PaymentResultPage() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("paymentResult");
    if (saved) {
      setResult(JSON.parse(saved));
    }
  }, []);

  if (!result)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium">
        Đang tải kết quả thanh toán...
      </div>
    );

  const isSuccess = result.success;

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-6 bg-[#E4E4E4]">
      <div className="w-[1100px] h-[800px] bg-white flex flex-col justify-center items-center gap-9">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${isSuccess ? "border-green-500" : "border-red-500"
            }`}
        >
          {isSuccess ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h2
          className={`text-2xl font-semibold ${isSuccess ? "text-green-600" : "text-red-600"
            }`}
        >
          {isSuccess ? "Bạn đã đặt hàng thành công" : "Thanh toán thất bại"}
        </h2>

        {isSuccess ? (
          <p className="text-gray-600">Mã đơn hàng: {result.orderId}</p>
        ) : (
          <p className="text-gray-600">{result.error || "Đã xảy ra lỗi không xác định"}</p>
        )}

        <Link
          href="/home"
          className="mt-4 border border-gray-300 px-6 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition"
        >
          Quay lại trang chủ
        </Link>
      </div>

    </div>
  );
}
