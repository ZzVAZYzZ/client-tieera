"use client";
import { useCallback, useState } from "react";

/**
 * Hook custom xử lý API đánh giá sản phẩm:
 * - checkCanReview(productId): kiểm tra xem user có quyền đánh giá không
 * - postReview({ product_id, rating, comment }): gửi đánh giá lên server
 */

export function useReview() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Hàm lấy token từ localStorage
  const getToken = useCallback(() => {
    return typeof window !== "undefined"
      ? localStorage.getItem("access_token") ||
          localStorage.getItem("accessToken")
      : null;
  }, []);

  // ✅ Kiểm tra quyền viết đánh giá
  const checkCanReview = useCallback(async (productId) => {
    if (!productId)
      throw new Error("Thiếu productId khi kiểm tra quyền đánh giá.");

    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) throw new Error("Bạn chưa đăng nhập.");

      const res = await fetch(`${API_URL}/api/review/check/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok){
        throw new Error(data.message || "Không thể kiểm tra quyền đánh giá.")
      };
      return data;
    } catch (err) {
      setError(err.message);
      if (err.message.includes("already reviewed")) {
        console.log("⚠️", err.message);
        return { success: false, alreadyReviewed: true };
      }
      // Không console.error nữa
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_URL, getToken]);

  // ✅ Gửi đánh giá
  const postReview = useCallback(async ({ product_id, rating, comment, user_name }) => {
    if (!product_id || !rating)
      throw new Error("Thiếu dữ liệu để gửi đánh giá.");

    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) throw new Error("Bạn chưa đăng nhập.");

      const res = await fetch(`${API_URL}/api/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id, rating, comment, user_name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể gửi đánh giá.");
      return data;
    } catch (err) {
      console.error("❌ Lỗi postReview:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_URL, getToken]);

  const getReviewsByProduct = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken(); // admin có thể cần token, nhưng FE cho public vẫn được
      const res = await fetch(`${API_URL}/api/review/${productId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Không thể tải danh sách đánh giá");
      return data.reviews;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_URL, getToken]);

  return {
    checkCanReview,
    postReview,
    getReviewsByProduct,
    loading,
    error,
  };
}
