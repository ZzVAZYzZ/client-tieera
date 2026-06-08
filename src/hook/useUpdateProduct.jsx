"use client";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "../redux/features/productSlice";
import { useRouter } from "next/navigation";

const useUpdateProduct = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { status, error } = useSelector((state) => state.products);

  const updateProductHandler = useCallback(
    (id, form, images) => {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();

      // ✅ append dữ liệu text
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // ✅ Set cứng main_index (ví dụ: ảnh đầu tiên là ảnh chính)
      formData.append("main_index", 0);

      // ✅ Append ảnh
      images.forEach((item) => {
        if (typeof item === "string") {
          // Ảnh cũ: truyền URL để backend giữ
          formData.append("old_images", item);
        } else if (item instanceof File) {
          // Ảnh mới: upload
          formData.append("images", item);
        }
      });

      // ✅ Gửi request
      dispatch(updateProduct({ id, data: formData, token })).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          alert("✅ Cập nhật sản phẩm thành công!");
          router.push("/dashboard");
        } else {
          alert("❌ Cập nhật thất bại: " + res.payload);
        }
      });
    },
    [dispatch, router]
  );

  return {
    loading: status === "loading",
    success: status === "succeeded",
    error,
    updateProduct: updateProductHandler,
  };
};

export default useUpdateProduct;
