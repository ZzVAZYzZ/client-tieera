"use client";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, resetStatus } from "../redux/features/productSlice";
import { useRouter } from "next/navigation";

const useAddProduct = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { status, error } = useSelector((state) => state.products);

  const addProductHandler = useCallback(
    async (form, images) => {
      const token = localStorage.getItem("access_token");

      // ✅ Chuẩn bị dữ liệu gửi kèm ảnh
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      images.forEach((file) => {
        if (file) formData.append("images", file);
      });

      // ✅ Dùng try/catch để kiểm soát lỗi
      try {
        const res = await dispatch(addProduct({ data: formData, token }));

        if (res.meta.requestStatus === "fulfilled") {
          alert("✅ Tạo sản phẩm thành công!");
          router.push("/dashboard");
        } else {
          alert("❌ Tạo sản phẩm thất bại: " + (res.payload || error));
        }
      } catch (err) {
        alert("🚨 Đã xảy ra lỗi không mong muốn!");
        console.error(err);
      } finally {
        // ✅ Reset trạng thái về idle sau khi xử lý xong
        dispatch(resetStatus());
      }
    },
    [dispatch, router, error]
  );

  return {
    loading: status === "loading",
    success: status === "succeeded",
    error,
    addProduct: addProductHandler,
  };
};

export default useAddProduct;
