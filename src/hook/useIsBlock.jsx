"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export const useIsBlock = () => {
  const [data, setData] = useState([]);               // danh sách user bị chặn
  const [loading, setLoading] = useState(false);      // load list
  const [blockLoading, setBlockLoading] = useState(false);     // đang chặn
  const [unblockLoading, setUnblockLoading] = useState(false); // đang gỡ chặn
  
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  };

  // Lấy danh sách user bị chặn
  const fetchBlockedUsers = useCallback(async () => {
    try {
      setLoading(true);

      const token = getToken();

      const res = await axios.get(`${backendUrl}/api/isBlock/blocked`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      setData(res.data || []);
    } catch (err) {
      console.error(
        "Fetch blocked users error:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchBlockedUsers();
  }, [fetchBlockedUsers]);

  // CHẶN user
  const blockUser = useCallback(
    async (userId) => {
      try {
        setBlockLoading(true);

        const token = getToken();

        const res = await axios.post(
          `${backendUrl}/api/isBlock/${userId}/block`,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const newDoc = res.data?.userBlock;

        // Cập nhật state local (thêm vào list nếu chưa có)
        if (newDoc) {
          setData((prev) => {
            if (prev.some((u) => u.user_id === newDoc.user_id)) return prev;
            return [...prev, newDoc];
          });
        }
      } catch (err) {
        console.error(
          "Block user error:",
          err.response?.data || err.message
        );
        throw err;
      } finally {
        setBlockLoading(false);
      }
    },
    [backendUrl]
  );

  // GỠ CHẶN user
  const unblockUser = useCallback(
    async (userId) => {
      try {
        setUnblockLoading(true);

        const token = getToken();

        await axios.post(
          `${backendUrl}/api/isBlock/${userId}/unblock`,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        // Xoá khỏi danh sách đang bị chặn
        setData((prev) => prev.filter((u) => u.user_id !== userId));
      } catch (err) {
        console.error(
          "Unblock user error:",
          err.response?.data || err.message
        );
        throw err;
      } finally {
        setUnblockLoading(false);
      }
    },
    [backendUrl]
  );

  return {
    data,             // danh sách user bị chặn
    loading,          // đang load list
    blockUser,        // chặn user
    unblockUser,      // gỡ chặn user
    blockLoading,     // loading khi chặn
    unblockLoading,   // loading khi gỡ chặn
    refetch: fetchBlockedUsers,
  };
};
