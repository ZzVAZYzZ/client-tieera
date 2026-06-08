// hooks/useOrderHistory.js
"use client"
import { useEffect, useState, useCallback } from 'react'; // Import useState và useCallback
import { useDispatch, useSelector } from 'react-redux';
// ⚠️ Thay đổi đường dẫn import này cho phù hợp
import { fetchOrdersByUser, resetOrderHistoryState } from '../redux/features/orderHistorySlice'; 

export const useOrderHistory = () => {
    const dispatch = useDispatch();
    
    // --- BỔ SUNG: Trạng thái để kích hoạt Refetch ---
    const [refetchTrigger, setRefetchTrigger] = useState(0); 
    
    // Tạo hàm refetch ổn định
    const refetch = useCallback(() => {
        // Tăng giá trị của trigger để kích hoạt useEffect
        setRefetchTrigger(prev => prev + 1);
        // Tùy chọn: Reset trạng thái để hiển thị loading nếu cần
        // dispatch(resetOrderHistoryState()); 
    }, [setRefetchTrigger]);
    // -------------------------------------------------
    
    // 1. Lấy user_id từ userSlice
    const { user } = useSelector((state) => state.user); 
    const userId = user?.user_id; // Lấy user_id nếu user tồn tại
    
    // 2. Lấy dữ liệu và trạng thái từ orderHistorySlice
    const { orders, status, error } = useSelector((state) => state.orderHistory); 

    useEffect(() => {
        // Điều kiện kích hoạt:
        // 1. Phải có userId
        // 2. Trạng thái đang là 'idle' (tải lần đầu) HOẶC đã được kích hoạt bởi refetchTrigger
        const shouldFetch = userId && (status === 'idle' || refetchTrigger > 0);
        
        if (shouldFetch) { 
            console.log(`Đang tải lịch sử đơn hàng cho User ID: ${userId}. Trigger: ${refetchTrigger}`);
            // Gọi thunk
            dispatch(fetchOrdersByUser(userId));
            
            // Nếu đây là lần refetch (trigger > 0), reset trigger về 0 sau khi gọi dispatch
            // để tránh lặp vô tận, và đảm bảo lần fetch tiếp theo được kiểm soát bởi status
            if (refetchTrigger > 0) {
                setRefetchTrigger(0); 
            }
        }
        
        // Cleanup: Reset trạng thái khi component unmount
        return () => {
             // Tùy chọn: 
             // dispatch(resetOrderHistoryState());
        };
    }, [userId, status, refetchTrigger, dispatch]); // Thêm refetchTrigger vào dependency array

    // Trả về dữ liệu và trạng thái đã được map lại và hàm refetch
    return { 
        orders, 
        isLoading: status === 'loading', 
        isSuccess: status === 'succeeded',
        isError: status === 'failed', 
        error,
        refetch 
    };
};