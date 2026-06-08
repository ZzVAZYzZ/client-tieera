// components/OrderDetailsCard.js

import React from 'react';
import Image from 'next/image';
// Import các icon Lucide cần thiết
import { Check, Truck, ListOrdered, DollarSign } from 'lucide-react';

// Hàm định dạng tiền tệ Việt Nam
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Hàm ánh xạ trạng thái sang tên hiển thị
const getStatusName = (status) => {
    switch (status) {
        case 'created':
            return 'Chờ xác nhận';
        case 'paid':
            return 'Đã thanh toán';
        case 'shipping':
            return 'Đang giao hàng';
        case 'completed':
            return 'Đã nhận hàng';
        case 'cancelled':
            return 'Đã huỷ';
        default:
            return 'Không xác định';
    }
};

// Mảng định nghĩa các bước tiến trình
const getTimelineSteps = (paymentMethod) => {
    const baseSteps = [
        { key: 'created', name: 'Chờ xác nhận', icon: ListOrdered },
        { key: 'shipping', name: 'Chờ giao hàng', icon: Truck },
        { key: 'completed', name: 'Đã nhận hàng', icon: Check },
    ];

    const paidStep = { key: 'paid', name: 'Đã thanh toán', icon: DollarSign };

    // Nếu là QRCODE/CreditCard, thêm bước "Đã thanh toán"
    if (paymentMethod === 'QRCode' || paymentMethod === 'CreditCard') {
        // Chèn 'paid' sau 'created'
        baseSteps.splice(1, 0, paidStep);
    }

    return baseSteps;
};

// Component con để hiển thị từng sản phẩm
const OrderItem = ({ item }) => {
    // ⚠️ Giả định bạn có một trường 'image_url' hoặc 'product_image' trong item
    // Hiện tại chỉ có product_name, tôi dùng placeholder.
    const itemTotal = (item.unit_price - item.discount) * item.quantity;
    const imageUrl = item.product_image;
    return (
        <div className="flex justify-between items-center py-4 border-b border-gray-100">
            <div className="flex items-center space-x-4">
                {/* Placeholder cho ảnh */}
                <div className="w-16 h-16 rounded-md shrink-0 relative overflow-hidden border border-gray-200">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={item.product_name}
                            // Bạn cần xác định width và height cố định
                            // object-cover đảm bảo ảnh đầy khung mà không bị méo
                            width={64}
                            height={64}
                            className="object-cover"
                        />
                    ) : (
                        // Nếu không có ảnh, hiển thị placeholder màu xám
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            No Image
                        </div>
                    )}
                </div>
                <div>
                    <p className="font-semibold text-gray-800">{item.product_name}</p>
                    <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                </div>
            </div>
            <p className="font-bold text-lg text-gray-800">{formatCurrency(itemTotal)}</p>
        </div>
    );
}

// Component chính
const OrderDetailsCard = ({ order }) => {
    if (!order) return null;

    const currentStatus = order.status;
    const timelineSteps = getTimelineSteps(order.payment_method);

    // Tính chỉ mục của bước hiện tại
    const currentStepIndex = timelineSteps.findIndex(step => step.key === currentStatus);

    // Tìm trạng thái để hiển thị màu nền (ví dụ: 'shipping')
    const activeStatusName = getStatusName(currentStatus);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl border border-gray-200">

            {/* --- 1. TIẾN TRÌNH ĐƠN HÀNG (Timeline) --- */}
            <div className={`p-5 mb-6 rounded-lg ${currentStepIndex >= 0 ? 'bg-amber-50' : 'bg-gray-100'}`}>
                <div className="flex justify-between items-center">
                    {timelineSteps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isActive = index === currentStepIndex;

                        return (
                            <React.Fragment key={step.key}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center 
                                            ${isCompleted ? 'bg-[#9B8D6F] text-white' : 'bg-gray-200 text-gray-500'} 
                                            ${isActive ? 'ring-2 ring-offset-2 ring-[#9B8D6F]' : ''}`}
                                    >
                                        <step.icon size={20} />
                                    </div>
                                    <p className={`mt-2 text-xs font-medium text-center ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {step.name}
                                    </p>
                                </div>
                                {/* Dấu gạch ngang (Chỉ hiển thị giữa các bước) */}
                                {index < timelineSteps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-[#9B8D6F]' : 'bg-gray-200'}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* --- 2. TRẠNG THÁI HIỆN TẠI VÀ SẢN PHẨM --- */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">

                {/* Trạng thái hiện tại (Blue bar) */}
                <div className="bg-blue-100 p-4 font-semibold text-lg text-blue-800 text-center">
                    {activeStatusName.toUpperCase()}
                </div>

                {/* Danh sách sản phẩm */}
                <div className="p-4">
                    {order.orderDetails.map((item, index) => (
                        <OrderItem key={index} item={item} />
                    ))}
                </div>

                {/* Tổng tiền và thông tin cơ bản */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between font-semibold text-gray-800 mb-2">
                        <span>Tổng tiền:</span>
                        <span>{formatCurrency(order.total_amount)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                        **ID đơn hàng:** <span className="float-right">{order.order_id}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        **Phương thức thanh toán:** <span className="float-right">{order.payment_method}</span>
                    </p>
                </div>
            </div>

            {/* Nút Liên hệ */}
            <div className="flex justify-end mt-4">
                <button
                    className="px-6 py-2 border border-[#9B8D6F] text-[#9B8D6F] rounded-lg transition-colors hover:bg-[#fcfbf9] text-sm font-semibold"
                    onClick={() => alert("Chức năng liên hệ chưa được triển khai.")}
                >
                    Liên hệ Shop
                </button>
            </div>
        </div>
    );
};

export default OrderDetailsCard;