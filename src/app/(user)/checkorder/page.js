// components/OrderLookupPage.js
"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation';
import orderLogo from '../../../assets/images/orderlogo.png';
import { useOrderTracking } from '../../../hook/useOrderTracking';
import OrderDetailsCard from './components/OrderDetailsCard';

const OrderLookupPage = () => {
    const [orderId, setOrderId] = useState('');
    const router = useRouter();

    const {
        data: orderData,
        isLoading,
        error,
        lookup,
        reset
    } = useOrderTracking();

    const handleSearch = () => {
        if (!isLoading && orderId.trim()) {
            reset();
            lookup(orderId.trim());
        }
    };

    useEffect(() => {
        console.log(orderData)
    }, [orderData])

    const handleGoBack = () => {
        // 💡 Logic thực tế: Quay lại trang trước đó hoặc trang chủ
        if(orderData && !error){
            reset();
        }else{
            reset();
            router.back();
        }
        
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfbf9] py-16">

            {/* Tiêu đề */}
            <h1 className="flex items-center text-3xl font-light text-[#333333] mb-12 uppercase tracking-wider">
                TRA CỨU THÔNG TIN ĐƠN HÀNG
                {/* Biểu tượng nhỏ bên cạnh tiêu đề */}
                <span className="ml-2 -mt-1">
                    {/* Giả định SearchIcon có thể nhận prop className để điều chỉnh kích thước */}
                    {/* Hoặc bạn có thể dùng một component icon khác của riêng bạn */}
                    <Search size={50} className=" text-[#9B8D6F]" />
                </span>
            </h1>

            {/* Nếu có dữ liệu, hiển thị thẻ chi tiết. Ngược lại, hiển thị form tra cứu. */}
            {(orderData && !error) ? (
                // --- HIỂN THỊ KẾT QUẢ ĐƠN HÀNG ---
                <div className="w-full max-w-4xl">
                    <OrderDetailsCard order={orderData} />
                    <div className="flex justify-center mt-6">
                        {/* Nút để tra cứu đơn hàng khác hoặc trở về */}
                        <button
                            onClick={handleGoBack}
                            className="px-8 py-3 text-base font-semibold uppercase text-[#9B8D6F] border border-[#C0C0C0] rounded-lg transition-all hover:bg-[#f3f0eb]"
                        >
                            TRỞ VỀ / TRA CỨU ĐƠN KHÁC
                        </button>
                    </div>
                </div>
            ) : (
                // --- HIỂN THỊ FORM TRA CỨU ---
                <div className="flex w-full max-w-4xl bg-white p-10 rounded-lg shadow-md">
                    {/* Cột trái: Hình minh họa */}
                    <div className="w-2/3 flex items-center justify-center">
                        <Image src={orderLogo} width={500} height={500} alt="order logo" />
                    </div>

                    {/* Cột phải: Form tra cứu */}
                    <div className="w-1/3 flex flex-col items-center justify-center p-4">
                        {/* ... (Input và Buttons) ... */}
                        <input
                            type="text"
                            placeholder="Mời bạn nhập ID đơn hàng"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full px-4 py-3 mb-6 text-sm border border-[#C0C0C0] rounded-lg outline-none focus:ring-1 focus:ring-[#9B8D6F]"
                        />

                        {error && (
                            <p className="text-red-500 text-xs mb-2 text-center">{error}</p>
                        )}

                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className={`w-full px-6 py-3 mb-4 text-sm font-semibold text-white uppercase rounded-lg shadow-md transition-all 
                                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#9B8D6F] hover:bg-[#8e826b]'}`}
                        >
                            {isLoading ? 'ĐANG TRA CỨU...' : 'TRA CỨU'}
                        </button>

                        <button
                            onClick={handleGoBack}
                            className="w-full px-6 py-3 text-sm font-semibold uppercase text-[#9B8D6F] border border-[#C0C0C0] rounded-lg transition-all hover:bg-[#f3f0eb]"
                        >
                            Trở về
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderLookupPage;