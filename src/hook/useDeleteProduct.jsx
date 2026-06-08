"use client";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, resetStatus } from "../redux/features/productSlice";

const useDeleteProduct = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.products);
  const deleteProductById = async (id) => {
    const token = localStorage.getItem("access_token");
    const res = await dispatch(deleteProduct({ id, token }));
    if (res.meta.requestStatus === "fulfilled") {
      console.log("✅ Xoá sản phẩm thành công:", res.payload);
    } else {
      console.error("❌ Lỗi xoá:", res.payload);
    }
  };

  return {
    deletingProduct: status === "loading",
    successDeleteProduct: status === "succeeded",
    errorDeleteProduct: error,
    deleteProductById,
  };
};

export default useDeleteProduct;