"use client";
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useSelector } from "react-redux";
import { useRefresh } from "../../../../hook/useRefresh";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

export default function Page() {
  const { user } = useSelector((state) => state.user);
  const orderInfo = useSelector((state) => state.orderInfo.orderInfo);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  useRefresh()
  const [status, setStatus] = React.useState("waiting"); // waiting | success | failed
  const backendIp = "10.102.62.243";
  // ✅ Tạo object chứa dữ liệu order thực tế
  const objNew = React.useMemo(() => {
    if (!user || !orderInfo) return null;

    const items = orderInfo.cart?.items || [];

    const orderDetails = items
      .filter((it) => it.selected !== false)
      .map((it) => ({
        product_id: it.product_id,
        product_name: it.product_name || it.name || "",
        quantity: Math.max(1, Number(it.quantity) || 1),
        unit_price: Number(it.unit_price ?? it.price ?? 0),
        discount: Math.max(0, Number(it.discount ?? it.discount_price ?? 0)),
      }));

    const total_amount = orderDetails.reduce((sum, d) => {
      const price = Math.max(0, (d.unit_price || 0) - (d.discount || 0));
      return sum + price * d.quantity;
    }, 0);
    

    return {
      user_id: user.user_id,
      total_amount,
      shipping_address: String(orderInfo.address || "").trim(),
      orderDetails,
      order_id: orderInfo.order_id || undefined,
    };
  }, [user, orderInfo]);

  React.useEffect(() => {
    if (!objNew) return;
    console.log(objNew.order_id);

    console.log("🧠 Connecting to socket server...");
    // const socket = io(`http://${backendIp}:8000`, {
    //   transports: ["websocket"],
    // });

    const socket = io(`${API_URL}`, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      socket.emit("joinOrderRoom", objNew.order_id);
      console.log("📤 Joined room:", objNew.order_id);
      socket.on("paymentStatus", (data) => {
        console.log("📩 Received paymentStatus:", data);

        if (data.success) {
          console.log("✅ Status changed to: success");
          setStatus("success");

          // ✅ Lưu trạng thái vào sessionStorage
          sessionStorage.setItem("paymentResult", JSON.stringify(data));

          setTimeout(() => {
            console.log("➡️ Redirecting to success page...");
            router.push("/payment/result");
          }, 2000);
        } else {
          console.log("❌ Status changed to: failed");
          setStatus("failed");

          // ❌ Lưu lỗi vào sessionStorage
          sessionStorage.setItem("paymentResult", JSON.stringify({
            success: false,
            error: data.error || "Thanh toán thất bại",
            orderId: data.orderId || null,
          }));

          setTimeout(() => {
            console.log("➡️ Redirecting to failure page...");
            router.push("/payment/result");
          }, 2000);
        }
      });

    });



    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("⚠️ Socket connection error:", err.message);
    });

    return () => {
      console.log("🧹 Cleaning up socket connection...");
      socket.disconnect();
    };
  }, [objNew]);
  if (!objNew) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          color: "#718096",
          fontFamily: "sans-serif",
        }}
      >
        <h2>Không tìm thấy thông tin đơn hàng</h2>
        <p>Vui lòng quay lại giỏ hàng và thử lại.</p>
      </div>
    );
  }


  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : "";
  // const backendUrl = `http://${backendIp}:8000/api/test-qr-scan`;
  const backendUrl = `${API_URL}/api/test-qr-scan`;
  const encodedJson = encodeURIComponent(JSON.stringify(objNew));
  const dataToEncode = `${backendUrl}?data=${encodedJson}&token=${token}&timestamp=${Date.now()}`;

  // --- STYLE ---
  const containerStyle = {
    maxWidth: "600px", // 🔥 rộng hơn (450 → 600)
    margin: "60px auto",
    padding: "40px", // 🔥 nới thêm padding
    textAlign: "center",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    boxShadow: "0 12px 25px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  };

  const dataSectionStyle = {
    textAlign: "left",
    marginTop: "25px",
    padding: "20px",
    backgroundColor: "#f7fafc",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  };

  const qrWrapperStyle = {
    marginBottom: "30px",
    padding: "20px",
    border: "3px solid #4c51bf",
    borderRadius: "12px",
    display: "inline-block",
    backgroundColor: "#ffffff",
  };

  // 👇 Giao diện test trạng thái


  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#4c51bf", marginBottom: "10px", fontSize: "26px" }}>
        💰 Thanh toán bằng Mã QR {status}
      </h2>
      <p
        style={{
          color: "#718096",
          marginBottom: "25px",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "15px",
          fontSize: "15px",
        }}
      >
        Quét mã dưới đây bằng điện thoại để hoàn tất đơn hàng.
      </p>

      {/* QR CODE */}
      <div style={qrWrapperStyle}>
        <QRCodeSVG
          value={dataToEncode}
          size={280} // 🔥 tăng kích thước QR
          level="H"
          fgColor="#1a202c"
          bgColor="#ffffff"
        />
      </div>

      {/* DỮ LIỆU ĐƠN HÀNG */}
      <div style={dataSectionStyle}>
        <h4 style={{ color: "#2d3748", marginBottom: "10px" }}>
          Chi tiết đơn hàng
        </h4>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            fontSize: "15px",
            lineHeight: "1.6",
          }}
        >
          <li>
            <b>Mã đơn hàng:</b>{" "}
            <span style={{ float: "right", color: "#38a169" }}>
              {objNew.order_id}
            </span>
          </li>
          <li>
            <b>Tổng tiền:</b>{" "}
            <span style={{ float: "right" }}>
              {objNew.total_amount.toLocaleString()} VND
            </span>
          </li>
          <li>
            <b>Người dùng:</b>{" "}
            <span style={{ float: "right" }}>{user.name || "Ẩn danh"}</span>
          </li>
          <li>
            <b>Địa chỉ:</b>{" "}
            <span
              style={{
                float: "right",
                maxWidth: "300px",
                textAlign: "right",
                display: "inline-block",
                whiteSpace: "normal",
              }}
            >
              {objNew.shipping_address}
            </span>
          </li>
        </ul>
      </div>

      <p
        style={{
          fontSize: "12px",
          color: "#a0aec0",
          marginTop: "20px",
          wordBreak: "break-all",
        }}
      >
        *Dữ liệu mã hóa:* {dataToEncode.substring(0, 90)}...
      </p>
    </div>
  );
}
