"use client";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrdersByStatus,
  updateOrderStatus,
} from "../redux/features/orderInfoSlice";
import axios from "axios";

const useFetchOrderByStatus = () => {
  const dispatch = useDispatch();
  const { orderAll, status, updateLoading, error } = useSelector(
    (state) => state.orderInfo
  );
  const fetchOrdersHandler = useCallback(
    async (statusValue) => {
      try {
        const res = await dispatch(fetchOrdersByStatus(statusValue));

        if (res.meta.requestStatus === "fulfilled") {
          console.log("✅ Lấy đơn hàng thành công:", res.payload);
        } else {
          console.error("❌ Lấy đơn hàng thất bại:", res.payload || error);
        }
      } catch (err) {
        console.error("🚨 Đã xảy ra lỗi không mong muốn:", err);
      }
    },
    [dispatch, error]
  );
  const handleUpdateOrderStatus = useCallback(
    async (orderId, newStatus) => {
      const res = await dispatch(updateOrderStatus({ orderId, newStatus }));
      if (res.meta.requestStatus === "fulfilled") {
        console.log("✅ Cập nhật trạng thái thành công:", res.payload);
      } else {
        console.error("❌ Cập nhật trạng thái thất bại:", res.payload || error);
      }
      return res;
    },
    [dispatch, error]
  );

  return {
    loadingOrders: status === "loading",
    successOrders: status === "succeeded",
    errorOrders: error,
    allOrders: orderAll,
    ordersUpdating: updateLoading,
    updateOrderStatus: handleUpdateOrderStatus,
    fetchOrdersByStatus: fetchOrdersHandler,
  };
};

export default useFetchOrderByStatus;
