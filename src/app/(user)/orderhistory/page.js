// components/OrderHistoryPage.js
"use client";
import React, { useEffect, useState } from "react";
import {
  History,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Package,
} from "lucide-react";
import { useOrderHistory } from "../../../hook/useOrderHistory"; // Hook bạn đã tạo
import OrderDetailModal from "./components/OrderDetailModal"; // Import Modal

// --- UTILITY ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
// --- UTILITY ---

/**
 * Component hiển thị tóm tắt một đơn hàng (Dựa trên image_9f79fa.png)
 */ const OrderSummaryCard = ({ order, onViewDetail }) => {
  const getStatusDisplay = (status) => {
    switch (status) {
      case "completed":
        return {
          text: "Đã hoàn thành",
          icon: <CheckCircle size={18} className="text-green-500 mr-1" />,
        };
      case "shipping":
        return {
          text: "Đang giao hàng",
          icon: <Package size={18} className="text-blue-500 mr-1" />,
        };
      case "paid":
        return {
          text: "Đã thanh toán",
          icon: <CheckCircle size={18} className="text-indigo-500 mr-1" />,
        };
      case "cancelled":
        return {
          text: "Đã hủy",
          icon: <XCircle size={18} className="text-red-500 mr-1" />,
        };
      default:
        return {
          text: "Đang chờ xác nhận",
          icon: <Clock size={18} className="text-gray-500 mr-1" />,
        };
    }
  };

  const statusInfo = getStatusDisplay(order.status);
  const isCompleted = order.status === "completed";

  return (
    <div className="p-4 md:p-5 border border-gray-200 bg-white hover:bg-gray-50 transition rounded-xl shadow-sm mb-4">
      {/* MOBILE + TABLET */}
      <div className="flex flex-col gap-4 lg:hidden">
        {/* Ngày */}
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Ngày</span>
          <div className="bg-[#fcf7e6] text-[#9B8D6F] text-xs font-semibold px-2 py-1 rounded">
            {new Date(order.order_date).toLocaleDateString("vi-VN")}
          </div>
        </div>

        {/* ID */}
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">ID đơn</span>
          <span className="font-mono text-sm text-gray-700 max-w-[160px] truncate">
            {order.order_id}
          </span>
        </div>

        {/* Tổng tiền */}
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">Tổng tiền</span>
          <span className="font-bold text-[#333]">
            {formatCurrency(order.total_amount)}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm font-semibold">
            {statusInfo.icon}
            <span className={isCompleted ? "text-green-600" : "text-gray-600"}>
              {statusInfo.text}
            </span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => onViewDetail(order)}
          className="w-full flex justify-center items-center px-4 py-2 text-xs font-semibold uppercase text-white bg-[#9B8D6F] rounded-lg hover:bg-[#8e826b]"
        >
          Xem chi tiết
          <Eye size={16} className="ml-2" />
        </button>
      </div>

      {/* DESKTOP (GIỮ LAYOUT CŨ) */}
      <div className="hidden lg:flex justify-between items-center">
        {/* Ngày */}
        <div className="w-1/6">
          <div className="bg-[#fcf7e6] text-[#9B8D6F] text-xs font-semibold px-2 py-1 rounded inline-block">
            {new Date(order.order_date).toLocaleDateString("vi-VN")}
          </div>
        </div>

        {/* ID + Tổng tiền */}
        <div className="flex w-3/6">
          <div className="w-1/2 flex flex-col">
            <span className="text-xs text-gray-500">ID đơn hàng</span>
            <span className="font-mono text-base text-gray-700">
              {order.order_id}
            </span>
          </div>

          <div className="w-1/2 flex flex-col">
            <span className="text-xs text-gray-500">Tổng tiền</span>
            <span className="font-bold text-[#333]">
              {formatCurrency(order.total_amount)}
            </span>
          </div>
        </div>

        {/* Status + Button */}
        <div className="flex w-2/6 items-center justify-between">
          <div className="flex items-center font-semibold">
            {statusInfo.icon}
            <span className={isCompleted ? "text-green-600" : "text-gray-600"}>
              {statusInfo.text}
            </span>
          </div>

          <button
            onClick={() => onViewDetail(order)}
            className="flex items-center px-4 py-2 text-xs font-semibold uppercase text-white bg-[#9B8D6F] rounded-lg hover:bg-[#8e826b]"
          >
            Xem chi tiết
            <Eye size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- TRANG CHÍNH ---

const OrderHistoryPage = () => {
  // Sử dụng hook của bạn
  const { orders, isLoading, isError, error, refetch } = useOrderHistory();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("access_token");
    setAccessToken(token);
  }, []);
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
  };

  // Nếu chưa xác thực xong hoặc đang tải đơn hàng
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfbf9] p-10">
        <p className="text-[#9B8D6F] text-lg">Đang tải lịch sử đơn hàng...</p>
      </div>
    );
  }

  // Nếu có lỗi
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfbf9] p-10">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Lỗi Tra Cứu Đơn Hàng
        </h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center min-h-[calc(100vh-80px)] bg-[#fcfbf9] py-16 px-4">
        <h2 className="text-2xl font-bold text-[#9B8D6F] mb-4">
          Bạn cần đăng nhập
        </h2>
        <button
          onClick={() => (window.location.href = "/login")}
          className="px-6 py-3 bg-[#9B8D6F] text-white rounded-lg"
        >
          Đi đến đăng nhập
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#fcfbf9] py-10 md:py-16 px-3 md:px-6">
      {/* Tiêu đề */}
      <h1 className="flex items-center text-xl md:text-3xl font-light text-[#333] mb-8 md:mb-12 uppercase tracking-wider text-center">
        <History size={30} className=" text-[#9B8D6F] mr-3" />
        LỊCH SỬ ĐẶT HÀNG CỦA BẠN
      </h1>
      <div className="w-full max-w-6xl">
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderSummaryCard
                key={order.order_id}
                order={order}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-600 mb-4">
              Bạn chưa có đơn hàng nào.
            </p>
          </div>
        )}
      </div>
      {/* Modal hiển thị chi tiết */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderHistoryPage;
