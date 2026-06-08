"use client";
import React, { useEffect, useState } from "react";
import useFetchOrderByStatus from "../../../../../hook/useOrder";
import axios from "axios";
import { Eye } from "lucide-react";
import OrderDetailModal from "./components/OrderDetailModal";

export default function Page() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const {
    fetchOrdersByStatus,
    allOrders,
    loadingOrders,
    updateOrderStatus,
    ordersUpdating,
    errorOrders,
  } = useFetchOrderByStatus();

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
  };

  useEffect(() => {
    fetchOrdersByStatus("all");
  }, []);
  // Hàm xử lý khi nhấn các nút
  const handleUpdateStatus = async (order_id, newStatus) => {
    try {
      await updateOrderStatus(order_id, newStatus);
      // Sau khi cập nhật, làm mới danh sách
      await fetchOrdersByStatus("all");
    } catch (err) {
      console.error("⚠️ Lỗi cập nhật trạng thái:", err);
    }
  };
  if (loadingOrders) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-[10px] p-6 flex flex-col gap-6 overflow-auto">
      {allOrders?.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        allOrders.map((order, index) => {
          const date = new Date(order.order_date);
          const formattedDate = date.toLocaleDateString("vi-VN");
          const formattedTime = date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={order._id || index}
              className="w-full h-[180px] border border-[#bfa87c] rounded-lg relative group"
            >
              <Eye
                className=" absolute right-1 top-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={() => handleViewDetail(order)}
              ></Eye>
              {/* Header */}
              <div className="grid grid-cols-6 bg-[#f9f7f3] text-[15px] font-medium text-gray-700 px-4 py-2 border-b border-[#bfa87c]">
                <span>Id đơn hàng</span>
                <span>Số lượng</span>
                <span>Thời gian đặt</span>
                <span>Ngày đặt hàng</span>
                <span>Tổng tiền</span>
                <span>Tình trạng đơn hàng</span>
              </div>

              {/* Row Info */}
              <div className="grid grid-cols-6 items-center px-4 py-2 text-[15px] border-b border-[#bfa87c]">
                <span
                  className="max-w-[150px] truncate cursor-pointer"
                  title={order.order_id}
                >
                  {order.order_id}
                </span>
                <span>
                  {order.orderDetails.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </span>
                <span>{formattedTime}</span>
                <span>{formattedDate}</span>
                <span>{order.total_amount.toLocaleString("vi-VN")}₫</span>
                <span className="flex items-center gap-1 text-[#2c2c2c]">
                  {order.status}
                </span>
              </div>

              <div className="flex flex-row">
                {/* Customer Info */}
                <div className="w-[50%] flex flex-col gap-1 px-4 py-3 text-[14px]">
                  <p className="">Thông tin đặt hàng </p>
                  <p>
                    <span className="font-semibold">Email khách hàng: </span>
                    {order.user_email}
                  </p>
                  <p>
                    <span className="font-semibold">Địa chỉ: </span>
                    {order.shipping_address}
                  </p>
                </div>

                {/* Payment + Action */}
                <div className="w-[50%] flex justify-between items-center px-4 py-3 text-[14px]">
                  <div className="flex flex-col gap-1 justify-center items-center">
                    <p className="font-medium">Phương thức thanh toán</p>
                    <p className="px-3 py-1 rounded text-[#4b3e1e] w-fit">
                      {order.payment_method}
                    </p>
                    {/* Trạng thái thanh toán */}
                    <p
                      className={`px-3 py-1 rounded w-fit ${
                        !order.isPaid
                          ? "bg-yellow-400 text-[#4b3e1e]"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {
                      !order.isPaid
                        ? "Chưa thanh toán"
                        : "Đã thanh toán"}
                    </p>
                  </div>

                  <div className="flex gap-3 items-center justify-center">
                    {order.status === "created" &&
                      order.payment_method !== "COD" && (
                        <div className="bg-yellow-400 text-[#4b3e1e] font-medium px-4 py-2 rounded cursor-default">
                          Đang đợi thanh toán
                        </div>
                      )}

                    {order.status === "created" &&
                      order.payment_method === "COD" && (
                        <button
                          className="bg-blue-500 text-white font-medium px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                          onClick={() =>
                            handleUpdateStatus(order.order_id, "shipping")
                          }
                        >
                          Giao hàng
                        </button>
                      )}

                    {order.status === "paid" && (
                      <button
                        className="bg-blue-500 text-white font-medium px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                        onClick={() =>
                          handleUpdateStatus(order.order_id, "shipping")
                        }
                      >
                        Giao hàng
                      </button>
                    )}

                    {order.status === "shipping" && (
                      <button
                        className="bg-green-500 text-white font-medium px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                        onClick={() =>
                          handleUpdateStatus(order.order_id, "completed")
                        }
                      >
                        Hoàn thành
                      </button>
                    )}

                    {order.status === "cancelled" && (
                      <div className="bg-gray-400 text-white font-medium px-4 py-2 rounded">
                        Đã hủy
                      </div>
                    )}

                    {order.status !== "completed" &&
                      order.status !== "cancelled" && (
                        <button
                          className="bg-red-500 text-white font-medium px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                          onClick={() =>
                            handleUpdateStatus(order.order_id, "cancelled")
                          }
                        >
                          Hủy
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      {/* Modal hiển thị chi tiết */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
