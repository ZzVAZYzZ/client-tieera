'client'
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { lookupOrder, resetOrderTrackingState } from '../redux/features/orderTrackingSlice';

export const useOrderTracking = () => {
    const dispatch = useDispatch();

    // Lấy dữ liệu từ Redux Store (giả sử slice được đặt tên là 'orderTracking')
    const {
        orderTrackingData: data,
        status,
        error
    } = useSelector((state) => state.orderTracking);

    // Chuyển status thành boolean để tiện sử dụng
    const isLoading = status === 'loading';

    // Hàm dispatch thunk lookupOrder
    const lookup = useCallback((orderId) => {
        if (orderId) {
            dispatch(lookupOrder({ orderId }));
        }
    }, [dispatch]);

    // Hàm reset trạng thái
    const reset = useCallback(() => {
        dispatch(resetOrderTrackingState());
    }, [dispatch]);

    return {
        data,
        isLoading,
        error,
        status,
        lookup,
        reset
    };
};