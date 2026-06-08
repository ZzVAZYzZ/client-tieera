"use client";
import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { UserRound, Ban } from "lucide-react";
import { useFetchUsers } from "../../../../../hook/useFetchUsers";
import { useIsBlock } from "../../../../../hook/useIsBlock";

const Page = () => {
  const { users, status, error } = useFetchUsers();
  const { data: blockedUsers, blockUser, blockLoading } = useIsBlock();

  // Set các user_id đã bị block (để biết user nào đang bị chặn)
  const blockedIdSet = useMemo(
    () => new Set(blockedUsers.map((u) => u.user_id)),
    [blockedUsers]
  );

  useEffect(() => {
    console.log(users);
  }, [users]);

  const handleClickBlock = async (userId, isBlocked) => {
    if (isBlocked) {
      alert("Người dùng đã bị chặn");
      return;
    }

    try {
      await blockUser(userId);
      alert("Đã chặn thành công");
    } catch (err) {
      alert("Chặn người dùng thất bại");
      console.error(err);
    }
  };

  if (status === "loading") {
    return (
      <div className="w-full h-full bg-white rounded-[10px] p-6 flex items-center justify-center">
        <p className="text-gray-700">Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="w-full h-full bg-white rounded-[10px] p-6 flex items-center justify-center">
        <p className="text-red-500">
          Lỗi tải danh sách người dùng: {error?.message || String(error)}
        </p>
      </div>
    );
  }
  if (users.role !== "admin") {
    return (
      <div className="w-full h-full rounded-[10px] flex flex-col gap-4 overflow-hidden">
        {users.length === 0 && (
          <p className="text-gray-600">Chưa có người dùng nào.</p>
        )}

        {/* Wrapper list có scroll dọc, chỉ scroll trong card */}
        <div className="h-100vh overflow-y-auto overflow-x-hidden pr-2 flex flex-col gap-4">
          {users.map((user) => {
            const isBlocked = blockedIdSet.has(user.user_id);

            return (
              <div
                key={user.user_id}
                className="w-full h-[150px] bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between px-6 py-4"
              >
                {/* Avatar + email */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.email}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserRound className="w-7 h-7 text-gray-700" />
                    )}
                  </div>

                  <p className="text-gray-800 text-sm md:text-base">
                    {user.email}
                  </p>
                </div>

                {/* Nút block màu cam bên phải */}
                <button
                  onClick={() => handleClickBlock(user.user_id, isBlocked)}
                  disabled={blockLoading} // chỉ khoá khi đang call API
                  className={`w-10 h-10 flex items-center justify-center rounded-md shadow-md active:scale-95 transition
                  ${
                    isBlocked
                      ? "bg-gray-300"
                      : "bg-[#ff5b3c] hover:brightness-110"
                  }`}
                  title={isBlocked ? "Đã bị chặn" : "Chặn người dùng"}
                >
                  <Ban
                    className={`w-5 h-5 ${
                      isBlocked ? "text-gray-500" : "text-white"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    <p>không có người dùng nào</p>;
  }
};

export default Page;
