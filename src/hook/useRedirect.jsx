"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

// Định nghĩa các trang yêu cầu vai trò Admin
const ADMIN_PAGES = ["/dashboard"];
// Định nghĩa các trang chỉ dành cho khách (sẽ chuyển hướng đi nếu đã đăng nhập)
const GUEST_ONLY_PAGES = ["/login", "/register"];

export const useRedirect = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  const pathname = usePathname();

  useEffect(() => {
    // ------------------
    // 1. User Đã Đăng Nhập
    // ------------------
    if (user) {
      // A. Kiểm tra vai trò Admin
      if (user.role === "admin") {
        // Nếu Admin đang ở trang login/register, đẩy về dashboard
        if (GUEST_ONLY_PAGES.includes(pathname)) {
          router.push("/dashboard");
        }
        return; // Ngừng kiểm tra
      }

      // B. Kiểm tra vai trò User (hoặc vai trò khác không phải admin)
      else {
        // user.role === 'user' (hoặc vai trò khác)

        // Chặn User truy cập trang Admin
        if (ADMIN_PAGES.includes(pathname)) {
          router.push("/"); // Đẩy về trang chủ
          return; // Ngừng kiểm tra
        }

        // Đẩy User khỏi trang Login/Register sau khi đăng nhập thành công
        if (GUEST_ONLY_PAGES.includes(pathname)) {
          router.push("/"); // Đẩy về trang chủ
        }
      }
    }

    // ------------------
    // 2. User Chưa Đăng Nhập (Guest)
    // ------------------
    else {
      // Chặn Guest truy cập trang Admin và các trang yêu cầu đăng nhập (ví dụ: /profile, /cart)

      // ⚠️ LƯU Ý: Bạn cần định nghĩa thêm `PROTECTED_PAGES` nếu muốn chặn
      // khách truy cập các trang như /profile hoặc /cart.
      // Hiện tại, tôi chỉ giữ lại logic chặn admin page cho khách.

      if (ADMIN_PAGES.includes(pathname)) {
        router.push("/login"); // Đẩy về trang đăng nhập
      }

      // Nếu không phải trang cần chặn, KHÁCH được tự do điều hướng.
    }
  }, [user, pathname, router]);
};
