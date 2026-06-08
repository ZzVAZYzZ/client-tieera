// components/OrderHistoryPage.js
"use client"
import React, { useEffect, useState } from 'react';
import { History, Eye, CheckCircle, Clock, XCircle, Package } from 'lucide-react';
import { useOrderHistory } from '../../../hook/useOrderHistory'; // Hook bạn đã tạo
import OrderDetailModal from './components/OrderDetailModal'; // Import Modal

// --- UTILITY ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};
// --- UTILITY ---

/**
 * Component hiển thị tóm tắt một đơn hàng (Dựa trên image_9f79fa.png)
 */
const OrderSummaryCard = ({ order, onViewDetail }) => {
    
    const getStatusDisplay = (status) => {
        switch (status) {
            case 'completed':
                return { text: 'Đã hoàn thành', icon: <CheckCircle size={18} className="text-green-500 mr-1" /> };
            case 'shipping':
                return { text: 'Đang giao hàng', icon: <Package size={18} className="text-blue-500 mr-1" /> };
            case 'paid':
                return { text: 'Đã thanh toán', icon: <CheckCircle size={18} className="text-indigo-500 mr-1" /> };
            case 'cancelled':
                return { text: 'Đã hủy', icon: <XCircle size={18} className="text-red-500 mr-1" /> };
            case 'created':
            default:
                return { text: 'Đang chờ xác nhận', icon: <Clock size={18} className="text-gray-500 mr-1" /> };
        }
    };

    const statusInfo = getStatusDisplay(order.status);
    const isCompleted = order.status === 'completed';

    return (
        // Thẻ bao bọc, mô phỏng giao diện màu kem/trắng
        <div className="flex justify-between items-center p-5 border border-gray-200 bg-white hover:bg-gray-50 transition-colors rounded-lg shadow-sm mb-4">
            
            {/* Tag Ngày tháng */}
            <div className="w-1/6">
                <div className="bg-[#fcf7e6] text-[#9B8D6F] text-xs font-semibold px-2 py-1 rounded-sm inline-block">
                    {new Date(order.order_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </div>
            </div>

            {/* Cột 2: ID đơn hàng & Tổng tiền */}
            <div className="flex w-3/6">
                <div className="w-1/2 flex flex-col items-start">
                    <span className="text-xs text-gray-500">ID đơn hàng</span>
                    <span className="text-base font-medium text-gray-700 font-mono">{order.order_id}</span>
                </div>
                <div className="w-1/2 flex flex-col items-start">
                    <span className="text-xs text-gray-500">Tổng tiền</span>
                    <span className="text-base font-bold text-[#333333]">{formatCurrency(order.total_amount)}</span>
                </div>
            </div>


            {/* Cột 3: Trạng thái & Xem chi tiết */}
            <div className="flex w-2/6 items-center justify-between">
                 <div className="flex items-center text-base font-semibold">
                    {statusInfo.icon}
                    <span className={isCompleted ? "text-green-600" : "text-gray-600"}>
                        {statusInfo.text}
                    </span>
                </div>
                
                {/* Nút Xem chi tiết */}
                <button
                    onClick={() => onViewDetail(order)}
                    className="flex items-center px-4 py-2 text-xs font-semibold uppercase text-white bg-[#9B8D6F] rounded-lg transition-all hover:bg-[#8e826b] shadow-md"
                >
                    Xem chi tiết
                    <Eye size={16} className="ml-2" />
                </button>
            </div>
        </div>
    );
};

// --- TRANG CHÍNH ---

const OrderHistoryPage = () => {
    // Sử dụng hook của bạn
    const { orders, isLoading, isError, error, refetch } = useOrderHistory(); 
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(()=>{
        refetch()
    },[refetch])

    const handleViewDetail = (order) => {
        setSelectedOrder(order);
    };
    
    // Nếu chưa xác thực xong hoặc đang tải đơn hàng
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#fcfbf9] p-10">
                <p className="text-[#9B8D6F] text-lg">Đang tải lịch sử đơn hàng...</p>
            </div>
        );
    }
    
    // Nếu có lỗi
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfbf9] p-10">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi Tra Cứu Đơn Hàng</h2>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#fcfbf9] py-16 px-4">
            
            {/* Tiêu đề */}
            <h1 className="flex items-center text-3xl font-light text-[#333333] mb-12 uppercase tracking-wider">
                <History size={30} className=" text-[#9B8D6F] mr-3" />
                LỊCH SỬ ĐẶT HÀNG CỦA BẠN
            </h1>
            
            <div className="w-full max-w-6xl">
                
                {orders && orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <OrderSummaryCard 
                                key={order.order_id} 
                                order={order} 
                                onViewDetail={handleViewDetail}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-md">
                        <p className="text-lg text-gray-600 mb-4">
                            Bạn chưa có đơn hàng nào.
                        </p>
                    </div>
                )}
            </div>

            {/* Modal hiển thị chi tiết */}
            {selectedOrder && (
                <OrderDetailModal 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
};

export default OrderHistoryPage;