"use client";
import React, { useEffect, useRef, useState } from "react";
import { X, SendHorizontal, Loader } from "lucide-react";

const AIChatBox = ({ isOpen, onClose }) => {
  // Chat state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      _id: Date.now(),
      text: input.trim(),
      senderRole: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: Integracja n8n tutaj
    // const response = await fetch("YOUR_N8N_WEBHOOK_URL", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ message: input.trim() })
    // });
    // const data = await response.json();
    // const aiMessage = {
    //   _id: Date.now() + 1,
    //   text: data.response, // Phản hồi từ n8n
    //   senderRole: "ai",
    //   timestamp: new Date(),
    // };
    // Tutaj wyślemy wiadomość do n8n i otrzymamy odpowiedź
    try {
      // Placeholder: Symulacja odpowiedzi AI
      // Zamień na rzeczywisty webhook n8n
      setTimeout(() => {
        const aiMessage = {
          _id: Date.now() + 1,
          text: "Đây là phản hồi test từ AI. Vui lòng tích hợp n8n webhook để nhận phản hồi thực sự.",
          senderRole: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed sm:bottom-[35px] sm:right-[105px] bottom-[20px] right-[20px] z-50">
      {/* KHUNG CHAT LỚN */}
      <div className="absolute bottom-[80px] right-0 w-[calc(100vw-20px)] h-[70vh] sm:w-[350px] sm:h-[500px] md:w-[400px] md:h-[600px] max-w-[400px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-40 flex flex-col">
        {/* Header */}
        <div className="h-[70px] bg-[#6ab04c] text-white flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
              AI
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-[16px]">AI Assistant</span>
              <span className="text-[11px] opacity-80">
                Hỗ trợ tự động 24/7
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 cursor-pointer hover:opacity-80 transition"
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
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${isUser
                      ? "bg-[#6ab04c] text-white rounded-br-none"
                      : "bg-[#F3F3F3] text-black rounded-bl-none"
                    }`}
                >
                  <span className="whitespace-pre-wrap break-words">
                    {m.text}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#F3F3F3] text-black rounded-2xl rounded-bl-none px-3 py-2 flex items-center gap-2">
                <Loader size={16} className="animate-spin" />
                <span className="text-sm">AI đang suy nghĩ...</span>
              </div>
            </div>
          )}

          {messages.length === 0 && !isLoading && (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center px-4">
              Xin chào! Tôi là AI hỗ trợ. Hãy đặt câu hỏi của bạn.
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Ô nhập tin nhắn */}
        <div className="h-20 px-4 flex items-center bg-white border-t border-gray-200">
          <div className="flex-1 flex items-center border border-[#6ab04c] rounded-full overflow-hidden px-4">
            <input
              placeholder="Nhập tin nhắn..."
              className="flex-1 h-10 outline-none text-[14px] text-[#3A3A3A] font-semibold bg-transparent"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) handleSendMessage();
              }}
              disabled={isLoading}
            />
          </div>
          <button
            className="ml-2 flex items-center justify-center disabled:opacity-50 cursor-pointer hover:opacity-80 transition"
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
          >
            <SendHorizontal size={22} color="#6ab04c" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBox;
