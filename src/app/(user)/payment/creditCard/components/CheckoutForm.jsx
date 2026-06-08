import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { clearOrder } from "../../../../../redux/features/orderInfoSlice";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const CheckoutForm = ({ paymentInfo }) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const router = useRouter();
    // 1. STATE THÔNG TIN
    const [amount, setAmount] = useState(paymentInfo?.total_amount);
    const [isProcessing, setIsProcessing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [city, setCity] = useState("");
    // Country code cho VN, không cần trường nhập liệu nếu chỉ hỗ trợ VN
    const country = "VN";

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : "";

    // 2. HÀM XỬ LÝ THANH TOÁN
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || isProcessing) return;

        setIsProcessing(true);

        // Bắt đầu: Tạo PaymentIntent từ Backend
        try {
            const res = await fetch(`${API_URL}/api/create-payment-intent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),

                },
                // 💡 CẬP NHẬT: GỬI THÊM THÔNG TIN KHÁCH HÀNG
                body: JSON.stringify({
                    amount,
                    name,
                    email,
                    addressLine1,
                    city,
                    order_id: paymentInfo.order_id
                }),
            });
            const { clientSecret } = await res.json();

            // Bước 2: Xác nhận thanh toán với Stripe
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: name,
                        email: email,
                        address: {
                            line1: addressLine1,
                            city: city,
                            country: country, // Đảm bảo là mã quốc gia 2 ký tự (ISO 3166-1 alpha-2)
                        },
                    },
                },
            });

            if (error) {
                console.error("❌ Lỗi thanh toán:", error.message);

                // ✅ Lưu kết quả thất bại vào session
                sessionStorage.setItem(
                    "paymentResult",
                    JSON.stringify({
                        orderId: paymentInfo.order_id,
                        success: false,
                    })
                );

                alert("❌ Thanh toán thất bại: " + error.message);
                router.push("/payment/result");
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                alert("✅ Thanh toán thành công! Mã giao dịch: " + paymentIntent.id);

                // Gửi kết quả thanh toán về server
                await fetch(`${API_URL}/api/payment-result`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ paymentIntent }),
                });

                // ✅ Lưu session chỉ với orderId và success
                sessionStorage.setItem(
                    "paymentResult",
                    JSON.stringify({
                        orderId: paymentInfo.order_id,
                        success: true,
                    })
                );

                // Xóa order Redux và chuyển trang
                dispatch(clearOrder());
                router.push("/payment/result");
            }

        } catch (fetchError) {
            alert("⚠️ Lỗi kết nối server: " + fetchError.message);
            sessionStorage.setItem(
                "paymentResult",
                JSON.stringify({
                    orderId: paymentInfo.order_id,
                    success: false,
                })
            );
            router.push("/payment/result");
        }

        setIsProcessing(false);
    };

    // 3. GIAO DIỆN VÀ STYLE
    const inputStyle = {
        padding: "10px",
        margin: "8px 0",
        border: "1px solid #d2d6dc",
        borderRadius: "6px",
        width: "100%",
        boxSizing: "border-box",
    };

    const cardElementContainerStyle = {
        border: "1px solid #d2d6dc",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "20px",
        backgroundColor: "#ffffff",
    };

    const buttonStyle = {
        backgroundColor: "#4c51bf", // Màu tím đậm
        color: "white",
        padding: "12px 20px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        width: "100%",
        fontSize: "16px",
        fontWeight: "bold",
        transition: "background-color 0.3s ease",
    };

    return (
        <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px", border: "1px solid #e2e8f0", borderRadius: "10px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
            <form onSubmit={handleSubmit} autoComplete="off">
                <h2 style={{ textAlign: "center", color: "#2d3748" }}>🛒 Hoàn tất Đơn hàng</h2>
                <h3 style={{ textAlign: "center", color: "#4c51bf", marginBottom: "20px" }}>
                    Tổng cộng: **{amount?.toLocaleString()} VND**
                </h3>

                {/* THÔNG TIN KHÁCH HÀNG */}
                <p style={{ fontWeight: 'bold', margin: '15px 0 5px 0', color: '#4a5568' }}>Thông tin thanh toán</p>
                <input
                    type="text"
                    placeholder="Tên đầy đủ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    required
                />
                <input
                    type="text"
                    placeholder="Địa chỉ"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    style={inputStyle}
                    required
                />
                <input
                    type="text"
                    placeholder="Thành phố"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={inputStyle}
                    required
                />

                {/* THÔNG TIN THẺ (CardElement) */}
                <p style={{ fontWeight: 'bold', margin: '25px 0 5px 0', color: '#4a5568' }}>Chi tiết thẻ</p>
                <div style={cardElementContainerStyle}>
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#4a5568",
                                    "::placeholder": { color: "#a0aec0" },
                                },
                                invalid: { color: "#e53e3e" },
                            },
                        }}
                    />
                </div>

                {/* NÚT SUBMIT */}
                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    style={{
                        ...buttonStyle,
                        opacity: (!stripe || isProcessing) ? 0.6 : 1,
                        backgroundColor: isProcessing ? "#2c3175" : buttonStyle.backgroundColor
                    }}
                >
                    {isProcessing ? "Đang xử lý..." : `Thanh toán ${amount?.toLocaleString()} VND`}
                </button>

                <p style={{ fontSize: "12px", color: "#718096", textAlign: "center", marginTop: "15px" }}>
                    <i className="fas fa-lock"></i> Thanh toán an toàn qua Stripe.
                </p>
            </form>
        </div>
    );
};

export default CheckoutForm;