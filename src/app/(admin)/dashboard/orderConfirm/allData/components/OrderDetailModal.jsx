// components/OrderDetailModal.js (Đã cập nhật thêm ID đơn hàng)

import React, { useRef } from 'react';
import { X, FileText } from 'lucide-react';

const formatCurrency = (amount) => {
    // Đảm bảo loại bỏ ký hiệu tiền tệ và chỉ giữ lại số, dấu chấm/phẩy
    const safeAmount = Math.max(0, amount || 0);
    return new Intl.NumberFormat('vi-VN', {
        style: 'decimal', // Dùng decimal để không hiển thị 'đ'
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(safeAmount) + 'đ'; // Thêm ký hiệu 'đ' thủ công
};

// --- Component Hàng thông tin (Label: Màu kem, Value: Màu trắng) ---
const DetailRow = ({ label, value }) => (
    <div className="flex border-t border-gray-200">
        {/* Cột Trái (Title) - Màu kem */}
        <div className="w-1/3 p-3 text-sm bg-[#fcf7e6] font-semibold text-gray-700">{label}</div>
        {/* Cột Phải (Value) - Màu trắng */}
        <div className="w-2/3 p-3 text-sm text-gray-900">{value}</div>
    </div>
);

// --- Component Hàng tổng tiền (Title: Màu kem, Value: Màu trắng & In đậm) ---
const TotalRow = ({ label, value }) => (
    <div className="flex border-t border-gray-200 font-bold">
        {/* Cột Trái (Title) - Màu kem */}
        <div className="w-1/3 p-3 text-sm bg-[#fcf7e6] text-[#333333]">{label}</div>
        {/* Cột Phải (Value) - Màu trắng, Giá trị In đậm */}
        <div className="w-2/3 p-3 text-base text-[#9B8D6F] font-bold">{value}</div>
    </div>
);


// --- Component để gom nhóm danh sách sản phẩm ---
const ProductListRow = ({ orderDetails }) => {
    return (
        <div className="flex border-t border-gray-200">
            {/* Cột Trái (Label) - Chỉ một label "Tên sản phẩm:" cho toàn bộ danh sách */}
            <div className="w-1/3 p-3 text-sm bg-[#fcf7e6] font-semibold text-gray-700">Tên sản phẩm:</div>

            {/* Cột Phải (Value) - Chứa danh sách các sản phẩm */}
            <div className="w-2/3 flex flex-col">
                {orderDetails.map((detail, index) => {
                    const lineTotal = detail.unit_price * detail.quantity - (detail.discount || 0);
                    return (
                        <div
                            key={index}
                            className={`flex justify-between items-start p-3 text-sm text-gray-900 
                                ${index > 0 ? 'border-t border-gray-100' : ''}`}
                        >
                            {/* Tên và số lượng */}
                            <div className="flex-1 pr-2">
                                <span className="font-medium text-gray-800">{detail.product_name}</span>
                                <span className="ml-2 text-gray-500 font-mono">x{detail.quantity}</span>
                            </div>
                            {/* Tổng giá trị */}
                            <div className="font-medium text-right whitespace-nowrap">
                                {formatCurrency(lineTotal)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    const contentRef = useRef(null);

    const customerName = order.user_name || 'Khách hàng';
    const statusDisplay = {
        'completed': 'Đã hoàn thành',
        'shipping': 'Đang giao hàng',
        'paid': 'Đã thanh toán',
        'cancelled': 'Đã hủy',
        'created': 'Đã đặt hàng',
    }[order.status] || 'Không rõ';


    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden relative">

                {/* 🎯 Gán Ref vào phần nội dung cần chụp (bao gồm Header và Body) */}
                <div ref={contentRef} className="pb-4">

                    {/* Header */}
                    <div className="flex justify-center items-center p-5 border-b relative">
                        <h2 className="text-xl font-bold text-gray-800">Thông tin đơn hàng</h2>
                        <button onClick={onClose} className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 print:hidden">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-0">
                        <div className="bg-white overflow-hidden">

                            {/* THÔNG TIN CHUNG */}
                            <DetailRow label="Tên khách hàng:" value={customerName} />

                            {/* ✅ ĐÃ THÊM: ID ĐƠN HÀNG */}
                            <DetailRow label="ID đơn hàng:" value={order.order_id} />

                            <DetailRow
                                label="Ngày đặt hàng:"
                                value={new Date(order.order_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            />
                            <DetailRow label="Trạng thái:" value={statusDisplay} />
                            <DetailRow label="Địa chỉ nhận hàng:" value={order.shipping_address} />
                            <DetailRow label="Phương thức thanh toán:" value={order.payment_method} />

                            {/* CHI TIẾT SẢN PHẨM (Đã gom nhóm) */}
                            <ProductListRow orderDetails={order.orderDetails} />

                            {/* TỔNG TIỀN */}
                            <TotalRow label="Tổng tiền:" value={formatCurrency(order.total_amount)} />

                        </div>
                    </div>
                </div>

                {/* Footer (Không bao gồm trong contentRef) */}
                
            </div>
        </div>
    );
};

export default OrderDetailModal;