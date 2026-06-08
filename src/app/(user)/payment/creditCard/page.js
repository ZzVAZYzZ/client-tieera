"use client";
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./components/CheckoutForm";
import { useSelector } from "react-redux";

const stripePromise = loadStripe(
  "pk_test_51SOtxjQta3QlNKNmwu69Pv2TxMWmnlbrwKZMDjjWm6INzkVDSAcZmhUfKPyhf98uLAFBTJMpRXKtXxQ6dKhOog6W00xYGOkau3"
);

export default function PaymentPage() {
  const { user } = useSelector((state) => state.user);
  const orderInfo = useSelector((state) => state.orderInfo.orderInfo);

  // 🧩 Tạo object phù hợp với backend model và orderSlice
  const objNew = React.useMemo(() => {
    if (!user || !orderInfo) return null;

    const items = orderInfo.cart?.items || [];

    const orderDetails = items
      .filter((it) => it.selected !== false) // chỉ lấy sp đã chọn
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
      order_id: orderInfo.order_id
    };
  }, [user, orderInfo]);

  React.useEffect(() => {
    if (objNew) {
      console.log("✅ objNew gửi đi thanh toán:", objNew);
    }
  }, [objNew]);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm paymentInfo={objNew}/>
    </Elements>
  );
}
