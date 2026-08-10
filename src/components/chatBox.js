"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  MessageSquareText,
  X,
  MessageCircle,
  SendHorizontal,
  Bot
} from "lucide-react";
import { io } from "socket.io-client";
import Messenger from "../assets/icons/messenger";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import AIChatBox from "./aiChatBox";
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const ChatBox = () => {
  // Redux
  const userId = useSelector((state) => state.user.user?.user_id);
  const userRole = useSelector((state) => state.user.user?.role);
  const router = useRouter();

  // UI state
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isMessengerHover, setIsMessengerHover] = useState(false);
  const isAnyChatOpen = isChatMenuOpen || isChatBoxOpen || isAIChatOpen;

  // chat state
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // unread + audio
  const [unreadCount, setUnreadCount] = useState(0);
  const audioRef = useRef(null);

  // để listener không bị "stale state"
  const isChatBoxOpenRef = useRef(false);
  useEffect(() => {
    isChatBoxOpenRef.current = isChatBoxOpen;
  }, [isChatBoxOpen]);

  useEffect(() => {
    if (!userId || !isChatBoxOpen) return;
    if (socketRef.current) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: {
        userId: userId,
        role: "user",
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ User socket connected:", socket.id);

      socket.emit("support:join");
      socket.emit("support:markAsRead");
    });

    socket.on("disconnect", () => {
      console.log("❌ User socket disconnected");
    });

    socket.on("support:history", (history) => {
      console.log("📜 support:history", history);
      setMessages(history || []);
    });

    socket.on("support:newMessage", (msg) => {
      console.log("💬 support:newMessage", msg);
      setMessages((prev) => [...prev, msg]);

      if (msg.senderRole === "admin") {
        if (!isChatBoxOpenRef.current) {
          setUnreadCount((prev) => prev + 1);

          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        } else {
          socket.emit("support:markAsRead");
        }
      }
    });

    socket.on("support:error", (err) => {
      console.error("support:error", err);
    });

    socket.on("support:markAsRead:done", () => {
      console.log("✅ user messages marked as read");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("support:history");
      socket.off("support:newMessage");
      socket.off("support:error");
      socket.off("support:markAsRead:done");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, isChatBoxOpen]);

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current && isChatBoxOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatBoxOpen]);

  // Toggle nút tròn
  const handleToggleChatButton = () => {
    if (isChatBoxOpen || isAIChatOpen) {
      // đang mở -> tắt hết
      setIsChatBoxOpen(false);
      setIsAIChatOpen(false);
      setIsChatMenuOpen(false);
      return;
    }
    setIsChatMenuOpen((prev) => !prev);
  };

  // Mở khung chat
  const handleDirectChat = () => {
    if (!userId) {
      router.push("/login");
      return;
    }

    setIsChatBoxOpen(true);
    setIsChatMenuOpen(false);

    const socket = socketRef.current;
    if (!socket) return;

    // join phòng + load lịch sử
    socket.emit("support:join");

    // mark read + reset badge
    socket.emit("support:markAsRead");
    setUnreadCount(0);
  };

  // Mở khung chat AI
  const handleDirectAI = () => {
    // if (!userId) {
    //   router.push("/login");
    //   return;
    // }

    setIsAIChatOpen(true);
    setIsChatMenuOpen(false);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const socket = socketRef.current;
    if (!socket || !userId) return;

    socket.emit("support:userSend", { text: input.trim() });
    setInput("");
  };

  if (userRole === "admin") {
    return <></>;
  } else {
    return (
      <div className="fixed sm:bottom-[35px] sm:right-[105px] bottom-[20px] right-[20px] z-50">
        {/* audio notification */}
        <audio
          ref={audioRef}
          src="/sound/notification_sound.mp3"
          preload="auto"
        />

        {/* AI Chat Box */}
        <AIChatBox isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

        {/* Popup menu nhỏ */}
        {isChatMenuOpen && (
          <div className="absolute top-[-155px] right-[10px] sm:right-[-10px] md:right-[-15px] w-[230px] bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-3 z-20">
            <button
              onClick={handleDirectAI}
              className="w-full h-[45px] rounded-lg bg-[#6ab04c] text-white font-medium hover:opacity-90 transition flex flex-row items-center justify-center gap-2 cursor-pointer"
            >
              <Bot /> <p>AI hỗ trợ</p>
            </button>
            <button
              onClick={handleDirectChat}
              className="w-full h-[45px] rounded-lg bg-[#9B8D6F] text-white font-medium hover:opacity-90 transition flex flex-row items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle /> <p>Chat trực tiếp</p>
            </button>
            <a
              href="https://m.me/840877375783975/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[45px] rounded-lg border border-[#9B8D6F] text-[#9B8D6F] hover:text-white font-medium flex items-center justify-center hover:bg-[#5b8aa9] transition gap-2"
              onMouseEnter={() => setIsMessengerHover(true)}
              onMouseLeave={() => setIsMessengerHover(false)}
            >
              <Messenger
                strokeAndFill={isMessengerHover ? "white" : "#2e9fe5"}
              />
              <p>Mở Messenger</p>
            </a>
          </div>
        )}

        {/* KHUNG CHAT LỚN */}
        {isChatBoxOpen && (
          <div className=" absolute bottom-[80px] right-0 w-[calc(100vw-20px)] h-[70vh] sm:w-[350px] sm:h-[500px] md:w-[400px] md:h-[600px] max-w-[400px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-40 flex flex-col">
            {" "}
            {/* Header */}
            <div className="h-[70px] bg-[#9B8D6F] text-white flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
                  A
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-[16px]">
                    Admin DG Jewelry
                  </span>
                  <span className="text-[11px] opacity-80">
                    Chúng tôi ở đây để sẵn sàng trợ giúp bạn.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsChatBoxOpen(false)}
                className="p-1 cursor-pointer"
              >
                <X size={22} color="white" />
              </button>
            </div>
            {/* Nội dung chat */}
            <div className="flex-1 bg-white px-3 py-3 overflow-y-auto space-y-2">
              {messages.map((m) => {
                const isUser = m.senderRole === "user";
                return (
                  <div
                    key={m._id}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                        isUser
                          ? "bg-[#9B8D6F] text-white rounded-br-none"
                          : "bg-[#F3F3F3] text-black rounded-bl-none"
                      }`}
                    >
                      <span className="whitespace-pre-wrap wrap-break-word">
                        {m.text}
                      </span>
                    </div>
                  </div>
                );
              })}

              {messages.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  Hãy đặt câu hỏi để được hỗ trợ nhanh chóng.
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
            {/* Ô nhập tin nhắn */}
            <div className="h-20 px-4 flex items-center">
              <div className="flex-1 flex items-center border border-[#9B8D6F] rounded-full overflow-hidden px-4">
                <input
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 h-10 outline-none text-[14px] text-[#3A3A3A] font-bold bg-transparent"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                />
              </div>
              <button
                className="ml-2 flex items-center justify-center disabled:opacity-50"
                onClick={handleSendMessage}
                disabled={!input.trim()}
              >
                <SendHorizontal size={22} color="#9B8D6F" />
              </button>
            </div>
          </div>
        )}

        {/* Nút chat / close + badge unread */}
        <button
          onClick={handleToggleChatButton}
          className={`relative w-[70px] h-[70px] bg-[#bfb5a0] rounded-full flex justify-center items-center cursor-pointer
        ${unreadCount > 0 && !isChatBoxOpen ? "chat-btn-shake" : ""}`}
        >
          {isAnyChatOpen ? (
            <X color="white" size={32} />
          ) : (
            <MessageSquareText color="white" size={32} />
          )}

          {/* Badge số tin chưa đọc */}
          {unreadCount > 0 && !isChatBoxOpen && (
            <div className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 bg-red-500 text-white text-[11px] rounded-full flex items-center justify-center font-semibold">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </button>

        {/* Animation CSS */}
        <style jsx>{`
          @keyframes chatButtonShake {
            0% {
              transform: translateX(0);
            }
            20% {
              transform: translateX(-2px);
            }
            40% {
              transform: translateX(2px);
            }
            60% {
              transform: translateX(-2px);
            }
            80% {
              transform: translateX(2px);
            }
            100% {
              transform: translateX(0);
            }
          }

          .chat-btn-shake {
            animation: chatButtonShake 0.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }
};

export default ChatBox;
