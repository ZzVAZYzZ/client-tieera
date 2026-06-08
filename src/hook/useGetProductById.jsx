"use client";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsById, resetStatus } from "../redux/features/productSlice";

const useFetchProductById = () => {
  const dispatch = useDispatch();
  const { product, status, error } = useSelector((state) => state.products);

  const fetchProductHandler = useCallback(
    async (id) => {
      const token = localStorage.getItem("access_token");

      try {
        const res = await dispatch(fetchProductsById({ id, token }));

        if (res.meta.requestStatus === "fulfilled") {
          console.log("✅ Lấy sản phẩm thành công:", res.payload);
        } else {
          console.error("❌ Lấy sản phẩm thất bại:", res.payload || error);
        }
      } catch (err) {
        console.error("🚨 Đã xảy ra lỗi không mong muốn:", err);
      } finally {
        dispatch(resetStatus());
      }
    },
    [dispatch, error]
  );

  return {
    loadingDetailProduct: status === "loading",
    successDetailProduct: status === "succeeded",
    errorDetailProduct: error,
    detailProduct: product,
    fetchProductById: fetchProductHandler,
  };
};

export default useFetchProductById;
