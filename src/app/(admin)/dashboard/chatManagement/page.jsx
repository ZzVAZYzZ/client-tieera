"use client";
import React, { useEffect, useState, useRef } from "react";
import { useFetchUsers } from "../../../../hook/useFetchUsers";
import { SendHorizontal, X } from "lucide-react";
import { io } from "socket.io-client";
import Image from "next/image";

const colors = [
  "#4CAF50", // xanh lá
  "#E91E63", // hồng
  "#3F51B5", // xanh dương
  "#FF9800", // cam
  "#F44336", // đỏ
  "#BF6B4A", // nâu cam
  "#0097A7", // xanh teal
];

<<<<<<< HEAD
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

=======
const SOCKET_URL = "http://localhost:8000";
>>>>>>> 340173087d8917f22f1c39af073ed3a9f86b8c03
const ADMIN_ID = "399810b5-85e0-465d-9cd8-5dc79fc87bfa";

const Page = () => {
  const { users } = useFetchUsers();

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [unreadByUser, setUnreadByUser] = useState({});
  const [sortedUsers, setSortedUsers] = useState([]);

  // notif popup góc phải
  const [notif, setNotif] = useState(null);

  // refs
  const socketRef = useRef(null);
  const audioRef = useRef(null);
  const selectedUserRef = useRef(null);
  const filteredUsersRef = useRef([]);

  // debug
  useEffect(() => {
    console.log("Users:", users);
  }, [users]);

  // chỉ lấy user role = "user"
  const filteredUsers = Array.isArray(users)
    ? users.filter((u) => u.role === "user")
    : [];

  // đồng bộ filteredUsers -> sortedUsers + ref
  useEffect(() => {
    setSortedUsers(filteredUsers);
    filteredUsersRef.current = filteredUsers;
  }, [JSON.stringify(filteredUsers)]);

  // đồng bộ selectedUser -> ref
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // KẾT NỐI SOCKET CHO ADMIN
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: {
        userId: ADMIN_ID,
        role: "admin",
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Admin socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Admin socket disconnected");
    });

    // lịch sử chat khi join 1 user
    socket.on("support:history", (history) => {
      console.log("📜 support:history", history);
      setMessages(history || []);
    });

    // tin nhắn mới trong phòng chat mà admin đang join
    socket.on("support:newMessage", (msg) => {
      console.log("💬 support:newMessage", msg);
      setMessages((prev) => [...prev, msg]);
    });

    // notify cho admin khi có message (từ bất kỳ phía nào)
    socket.on("support:newMessageAdmin", (msg) => {
      console.log("📥 support:newMessageAdmin (notify list)", msg);
      const userId = msg.userId;
      if (!userId) return;

      // luôn move user này lên đầu list khi có tin nhắn
      setSortedUsers((prev) => {
        if (!Array.isArray(prev)) return prev;
        const idx = prev.findIndex((u) => u.user_id === userId);
        if (idx === -1) return prev; // user chưa có trong list
        const clickedUser = prev[idx];
        const rest = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        return [clickedUser, ...rest];
      });

      // chỉ xử lý unread + notif nếu là tin từ USER
      if (msg.senderRole === "user") {
        const isCurrent = selectedUserRef.current?.user_id === userId;

        // tăng unread nếu admin không mở phòng đó
        if (!isCurrent) {
          setUnreadByUser((prev) => ({
            ...prev,
            [userId]: (prev[userId] || 0) + 1,
          }));
        }

        // nếu không mở phòng đó -> hiện popup + ting
        if (!isCurrent) {
          const list = filteredUsersRef.current || [];
          const foundUser = list.find((u) => u.user_id === userId);
          const userName = foundUser?.name || "Khách hàng";

          setNotif({
            userId,
            userName,
            text: msg.text,
          });

          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }

          setTimeout(() => {
            setNotif((current) =>
              current && current.userId === userId ? null : current
            );
          }, 5000);
        }
      }
    });

    socket.on("support:markAsRead:done", ({ conversationId, updatedCount }) => {
      console.log(
        "✅ support:markAsRead:done",
        conversationId,
        "updated:",
        updatedCount
      );
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("support:history");
      socket.off("support:newMessage");
      socket.off("support:newMessageAdmin");
      socket.off("support:markAsRead:done");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // yêu cầu backend gửi map unread
    socket.emit("support:adminInitUnread");

    const handleInitUnread = (map) => {
      console.log("📊 initUnread:", map);
      setUnreadByUser(map || {});
    };

    socket.on("support:initUnread", handleInitUnread);

    return () => {
      socket.off("support:initUnread", handleInitUnread);
    };
  }, []);

  // khi chọn user bên trái
  //@param  user
  // @result chọn user để chat
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages([]);

    const socket = socketRef.current;
    if (!socket) return;

    // join phòng chat của user này + load history
    socket.emit("support:adminJoinUser", { userId: user.user_id });

    // đánh dấu đã đọc tất cả tin user này gửi
    socket.emit("support:markAsRead", { userId: user.user_id });

    // reset unread
    setUnreadByUser((prev) => ({
      ...prev,
      [user.user_id]: 0,
    }));

    // tắt notif nếu đang hiện của user này
    setNotif((current) =>
      current && current.userId === user.user_id ? null : current
    );
  };

  //@param  null
  // @result nhấn để gửi tin nhắn
  const handleSendMessage = () => {
    if (!input.trim() || !selectedUser) return;
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("support:adminSend", {
      userId: selectedUser.user_id,
      text: input.trim(),
    });

    setInput("");
  };

  return (
    <div className="w-full h-full relative">
      {/* audio ting */}
      <audio
        ref={audioRef}
        src="/sound/notification_sound.mp3"
        preload="auto"
      />

      {/* NOTIF POPUP GÓC PHẢI */}
      {notif && (
        <div
          className="fixed bottom-6 right-6 z-50"
          onClick={() => {
            const user = sortedUsers.find((u) => u.user_id === notif.userId);
            if (user) {
              handleSelectUser(user);
            }
            setNotif(null);
          }}
        >
          <div className="notif-popup w-80 bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl border border-gray-200 px-4 py-3 flex flex-col gap-2 cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(0,0,0,0.18)]">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold tracking-wide text-gray-800">
                Tin nhắn mới
              </span>
              <button
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setNotif(null);
                }}
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>

            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-800">
                {notif.userName}
              </span>{" "}
              vừa gửi:
            </div>

            <div className="text-[13px] text-gray-900 leading-snug line-clamp-2">
              “{notif.text}”
            </div>

            <div className="mt-1 text-[11px] text-[#9B8D6F] italic">
              Bấm vào thông báo để mở cuộc trò chuyện
            </div>
          </div>
        </div>
      )}

      {/* LAYOUT CHÍNH */}
      <div className="w-full h-full flex flex-row">
        {/* CỘT TRÁI – DANH SÁCH USER */}
        <div className="h-full w-[250px] bg-[#E7D7B0] rounded-l-lg flex justify-center items-center">
          <div className="w-[95%] h-[95%] rounded-2xl overflow-y-auto">
            {sortedUsers.map((user, index) => {
              const initial = user.name?.[0]?.toUpperCase() || "?";
              const color = colors[index % colors.length];

              const unread = unreadByUser[user.user_id] || 0;

              const previewText = user.email || "Hello";
              const isLong = previewText.length > 35;
              const shortText = isLong
                ? previewText.slice(0, 35) + "..."
                : previewText;

              const isActive = selectedUser?.user_id === user.user_id;

              return (
                <div
                  key={user.user_id}
                  onClick={() => handleSelectUser(user)}
                  className={`flex items-center px-4 py-4 border-b border-[#d2c39e] cursor-pointer transition-colors ${
                    isActive ? "bg-[#ddcca2]" : "hover:bg-[#e0cfaa]"
                  }`}
                >
                  {/* Avatar */}
                  <div className="mr-4 relative">
                    {user.avatar ? (
                      <Image
                        width={48}
                        height={48}
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: color }}
                      >
                        {initial}
                      </div>
                    )}

                    {/* Badge unread */}
                    {unread > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {unread > 99 ? "99+" : unread}
                      </div>
                    )}
                  </div>

                  {/* Tên + đoạn text */}
                  <div className="flex-1 overflow-hidden">
                    <div className="font-semibold text-[18px] truncate">
                      {user.name || "Unknown"}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="truncate">{shortText}</span>
                      {isLong && (
                        <button className="ml-2 text-xs text-gray-500 whitespace-nowrap">
                          See more
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CỘT PHẢI – KHUNG CHAT */}
        <div className="h-full flex-1 bg-[#F3F3F3] rounded-r-lg flex flex-col">
          {!selectedUser && (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
              Chọn một khách hàng ở bên trái để xem cuộc trò chuyện
            </div>
          )}

          {selectedUser && (
            <>
              {/* HEADER */}
              <div className="h-[70px] border-b border-gray-300 flex items-center px-6 bg-white rounded-tr-lg">
                <span className="text-2xl font-light">
                  {selectedUser.name || "Khách hàng"}
                </span>
              </div>

              {/* VÙNG CHAT */}
              <div className="flex-1 bg-white px-10 py-6 overflow-y-auto space-y-3">
                {messages.map((m) => {
                  const isAdmin = m.senderRole === "admin";
                  return (
                    <div
                      key={m._id}
                      className={`flex ${
                        isAdmin ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                          isAdmin
                            ? "bg-[#E7D7B0] text-black rounded-br-none"
                            : "bg-[#F0F0F0] text-black rounded-bl-none"
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {m.text}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {messages.length === 0 && (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Chưa có tin nhắn nào, hãy bắt đầu hỗ trợ khách hàng.
                  </div>
                )}
              </div>

              {/* INPUT GỬI TIN NHẮN */}
              <div className="h-20 border-t border-gray-300 bg-white rounded-br-lg px-6 flex items-center">
                <div className="flex-1 flex items-center border border-gray-300 rounded-full px-5 py-3">
                  <input
                    type="text"
                    placeholder="Type a message"
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                  />
                  <button
                    className="ml-3 w-10 h-10 rounded-xl bg-[#EAEAEA] flex items-center justify-center shadow-md disabled:opacity-60"
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                  >
                    <SendHorizontal size={20} color="black" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* animation cho notif */}
      <style jsx>{`
        @keyframes notifSlideUpFade {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .notif-popup {
          animation: notifSlideUpFade 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Page;
