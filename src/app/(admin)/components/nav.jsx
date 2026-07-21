"use client";
import MenuAdminIcon from "../../../assets/icons/admin/menu_admin_icon";
import AddIcon from "../../../assets/icons/admin/add_icon";
import DoanthuIcon from "../../../assets/icons/admin/doanthu_icon";
import ArvatarIcon from "../../../assets/icons/admin/arvatar_icon";
import QuanlyIcon from "../../../assets/icons/admin/quanly_icon";

import React, { useEffect } from "react";
import Link from "next/link";

import { useRedirect } from "../../..//hook/useRedirect";
import LogoutIcon from "../../../assets/icons/admin/logout_icon";
import { useAuth } from "../../../hook/useAuth";
import { useDispatch } from "react-redux";
import { resetUserState } from "../../../redux/features/userSlice";
import { useRouter } from "next/navigation";
import { House, MessageCircle, BookUser } from "lucide-react";

const Nav = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isShowOrder, setIsShowOrder] = React.useState(false);
  const [isShowRevenue, setIsShowRevenue] = React.useState(false);
  const [isShowIsBlock, setIsShowIsBlock] = React.useState(false);
  useAuth();
  useRedirect();
<<<<<<< HEAD
=======

>>>>>>> 340173087d8917f22f1c39af073ed3a9f86b8c03
  // @param null
  // @result gọi API logout, xoá token client, reset Redux user, điều hướng về trang home
  const handleLogout = async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // 🧠 Gọi API logout để xoá refreshToken trong DB + cookie
      await fetch(`${backendUrl}/api/users/logout`, {
        method: "POST",
        credentials: "include", // gửi cookie
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 🧹 Xóa token phía client (nếu bạn lưu ở localStorage / sessionStorage)
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("access_token");

      // 🧹 Xóa state user trong Redux (nếu bạn có reducer)
      // dispatch(logoutUser()); // nếu có action logout

      dispatch(resetUserState());
      router.push("/home");
    } catch (error) {
      console.error("❌ Lỗi khi đăng xuất:", error);
      alert("Đăng xuất thất bại!");
    }
  };
  return (
    <nav className=" w-[250px] h-full flex flex-col justify-between items-start relative bg-white rounded-[10px] py-[42px] pl-[22px]">
      <div className=" absolute w-[80%] border border-[#D9D9D9] top-8"></div>
      <div className=" flex flex-col gap-4 justify-center items-start">
        {/* Quản lý sản phẩm */}
        <Link href={"/dashboard"}>
          <div className=" flex flex-row gap-3.5 cursor-pointer justify-center items-center">
            <MenuAdminIcon />
            <p>Quản lý sản phẩm</p>
          </div>
        </Link>
        {/* Thống kê */}
        <div
          onClick={() => setIsShowRevenue(!isShowRevenue)}
          className=" flex flex-row gap-3.5 cursor-pointer  justify-center items-center"
        >
          <DoanthuIcon />
          <p>Thống kê</p>
        </div>
        {/* Menu con Thống kê (dropdown) */}
        {isShowRevenue && (
          <div className="ml-8 mt-2 flex flex-col gap-2 text-sm text-gray-700">
            <Link href="/dashboard/statistics/revenue">
              <p className="cursor-pointer hover:text-blue-500">Doanh thu</p>
            </Link>
            <Link href="/dashboard/statistics/unitSold">
              <p className="cursor-pointer hover:text-blue-500">
                Số lượng sản phẩm
              </p>
            </Link>
          </div>
        )}
        {/* Quản lý đơn hàng */}
        <div
          onClick={() => setIsShowOrder(!isShowOrder)}
          className=" flex flex-row gap-5 cursor-pointer  justify-center items-center"
        >
          <QuanlyIcon />
          <p>Quản lý đơn hàng</p>
        </div>
        {/* Menu con Quản lý đơn hàng (dropdown) */}
        {isShowOrder && (
          <div className="ml-8 mt-2 flex flex-col gap-2 text-sm text-gray-700">
            <Link href="/dashboard/orderConfirm/validation">
              <p className="cursor-pointer hover:text-blue-500">
                Xác nhận đơn hàng
              </p>
            </Link>
            <Link href="/dashboard/orderConfirm/allData">
              <p className="cursor-pointer hover:text-blue-500">
                Xem tất cả đơn hàng
              </p>
            </Link>
          </div>
        )}
        {/* Quản lý người dùng */}
        <div
          onClick={() => setIsShowIsBlock(!isShowIsBlock)}
          className=" flex flex-row gap-3.5 cursor-pointer justify-center items-center">
          <BookUser />
          <p>Quản lý người dùng</p>
        </div>
        {/* Menu con Quản lý người dùng (dropdown) */}
        {isShowIsBlock && (
          <div className="ml-8 mt-2 flex flex-col gap-2 text-sm text-gray-700">
            <Link href="/dashboard/usersManagement/usersList">
              <p className="cursor-pointer hover:text-blue-500">
                Danh sách người dùng
              </p>
            </Link>
            <Link href="/dashboard/usersManagement/blockList">
              <p className="cursor-pointer hover:text-blue-500">
                Danh sách bị chặn
              </p>
            </Link>
          </div>
        )}
        {/* Quản lý đoạn chat */}
        <Link href={"/dashboard/chatManagement"}>
          <div className=" flex flex-row gap-3.5 cursor-pointer justify-center items-center">
            <MessageCircle />
            <p>Quản lý đoạn chat</p>
          </div>
        </Link>
      </div>
      <div className=" flex flex-col gap-3 justify-center items-start">
        <div className=" flex flex-row gap-3.5 cursor-pointer justify-center items-center">
          <ArvatarIcon />
          <p>Admin</p>
        </div>
        <div
          onClick={() => {
            router.push("/");
          }}
          className=" flex flex-row gap-3.5 cursor-pointer justify-center items-center"
        >
          <House />
          <p>User Homepage</p>
        </div>
        <div
          className=" flex flex-row gap-6 cursor-pointer justify-center items-center ml-[3px]"
          onClick={handleLogout}
        >
          <LogoutIcon />
          <p>Logout</p>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
