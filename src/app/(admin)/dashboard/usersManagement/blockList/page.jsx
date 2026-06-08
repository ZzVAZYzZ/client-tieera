"use client";

import { Undo2, UserRound } from "lucide-react";
import Image from "next/image";
import { useIsBlock } from "../../../../../hook/useIsBlock";

const BlockListPage = () => {
  const {
    data: blockedUsers,
    loading,
    unblockUser,
    unblockLoading,
  } = useIsBlock();

  const handleClickUnblock = async (userId) => {
    try {
      await unblockUser(userId);
      alert("Đã gỡ chặn thành công");
    } catch (err) {
      console.error(err);
      alert("Gỡ chặn thất bại");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white rounded-[10px] p-6 flex items-center justify-center">
        <p className="text-gray-700">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-[10px] flex flex-col gap-4 overflow-hidden">
      {blockedUsers.length === 0 && (
        <p className="text-white">Không có người dùng nào bị chặn.</p>
      )}

      <div className="h-100vh overflow-y-auto overflow-x-hidden pr-2 flex flex-col gap-4">
        {blockedUsers.map((user) => (
          <div
            key={user._id || user.user_id}
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
                  <UserRound className="w-7 h-7 text-[#ff5b3c]" />
                )}
              </div>

              <p className="text-gray-800 text-sm md:text-base">
                {user.email}
              </p>
            </div>

            {/* Nút gỡ chặn */}
            <button
              disabled={unblockLoading}
              onClick={() => handleClickUnblock(user.user_id)}
              className="w-10 h-10 flex items-center justify-center rounded-md bg-[#1976d2] shadow-md hover:brightness-110 active:scale-95 disabled:opacity-60 transition"
              title="Gỡ chặn người dùng"
            >
              <Undo2 className="w-5 h-5 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockListPage;
