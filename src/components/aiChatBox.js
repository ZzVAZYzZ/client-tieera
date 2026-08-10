"use client";
import React, { useEffect, useRef, useState } from "react";
import { X, SendHorizontal, Loader, ShoppingBag, Mic, Volume2, Square } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// const API_URL = "http://localhost:8000";
const AIChatBox = ({ isOpen, onClose }) => {
  const userId = useSelector((state) => state.user.user?.user_id) || "anonymous";
  // Chat state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const [transcript, setTranscript] = useState("");

  const getProductRoute = (product) => {
    const normalized = (
      product.category || product.type || product.name || ""
    )
      .toString()
      .toLowerCase();

    if (normalized.includes("bong tai")) return "earring";
    if (normalized.includes("day chuyen")) return "necklace";
    if (normalized.includes("nhan")) return "ring";
    if (normalized.includes("vong tay")) return "bracelet";
    return "product";
  };

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && !recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsRecording(true);
        setTranscript("");
      };

      recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setInput((prev) => prev + transcript);
          } else {
            interimTranscript += transcript;
          }
        }
        setTranscript(interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setTranscript("");
      };

      recognitionRef.current = recognition;
    }

    // Initialize Speech Synthesis
    if (!synthRef.current) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Handle start recording
  const handleStartRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  // Handle stop recording
  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Handle speak message
  const handleSpeak = (text) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 1;
    utterance.pitch = 1;

    // Find Vietnamese voice
    const voices = synthRef.current.getVoices();
    const vietnameseVoice = voices.find(
      (voice) => voice.lang.includes("vi") || voice.lang.includes("vi-VN")
    );
    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

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

    try {
      const response = await fetch(`${API_URL}/api/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: userId,
          limit: 5,
          type: "text",
          message: input.trim() 
        })
      });
      
      const data = await response.json();
      
      // Handle response format: { status, message, data, category }
      const aiMessageText = data?.message || "Không thể lấy phản hồi";
      const products = data?.data || [];

      const aiMessage = {
        _id: Date.now() + 1,
        text: aiMessageText,
        senderRole: "ai",
        timestamp: new Date(),
        category: data?.category,
        products: products.map((product) => ({
          ...product,
          category: product.category || data?.category,
        })),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      const errorMessage = {
        _id: Date.now() + 1,
        text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.",
        senderRole: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
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
              <div key={m._id}>
                {/* Text message */}
                <div
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
                    {!isUser && (
                      <button
                        onClick={() => handleSpeak(m.text)}
                        disabled={isSpeaking}
                        className="ml-2 inline-flex items-center justify-center p-1 hover:opacity-80 cursor-pointer disabled:opacity-50"
                        title="Nghe"
                      >
                        <Volume2 size={14} color="#6ab04c" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Product list */}
                {m.products && m.products.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {m.products.map((product) => {
                      const route = getProductRoute(product);
                      const href = `https://tieera.vercel.app/${route}/${product.product_id}`;
                      return (
                        <Link
                          href={href}
                          key={product.product_id}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer">
                            {/* Product image */}
                            {product.images && product.images.length > 0 && (
                              <div className="relative w-full h-32 bg-gray-200 overflow-hidden">
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover hover:scale-105 transition"
                                />
                              </div>
                            )}
                            
                            {/* Product info */}
                            <div className="p-2">
                              <h4 className="font-semibold text-sm text-gray-800 line-clamp-2">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                Chất liệu: {product.material}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-gray-400 line-through">
                                    ₫{product.price?.toLocaleString()}
                                  </span>
                                  <span className="text-sm font-bold text-[#6ab04c]">
                                    ₫{(product.price - product.discount_price)?.toLocaleString()}
                                  </span>
                                </div>
                                <ShoppingBag size={14} className="text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
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
        <div className="px-4 py-3 bg-white border-t border-gray-200">
          {/* Transcript display */}
          {(transcript || isRecording) && (
            <div className="mb-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600">
                {isRecording ? "🎤 Đang ghi âm..." : "Đoạn văn bản:"} {transcript}
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center border border-[#6ab04c] rounded-full overflow-hidden px-4">
              <input
                placeholder="Nhập tin nhắn..."
                className="flex-1 h-10 outline-none text-[14px] text-[#3A3A3A] font-semibold bg-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) handleSendMessage();
                }}
                disabled={isLoading || isRecording}
              />
            </div>
            
            {isRecording ? (
              <button
                className="p-2 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                onClick={handleStopRecording}
                title="Dừng ghi âm"
              >
                <Square size={18} />
              </button>
            ) : (
              <button
                className="p-2 flex items-center justify-center rounded-full hover:bg-gray-200 transition cursor-pointer disabled:opacity-50"
                onClick={handleStartRecording}
                disabled={isLoading}
                title="Ghi âm"
              >
                <Mic size={18} color="#6ab04c" />
              </button>
            )}
            
            <button
              className="p-2 flex items-center justify-center disabled:opacity-50 cursor-pointer hover:opacity-80 transition"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              title="Gửi"
            >
              <SendHorizontal size={20} color="#6ab04c" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatBox;
