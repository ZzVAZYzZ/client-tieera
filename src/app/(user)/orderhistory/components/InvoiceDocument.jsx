import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// --- 1. Đăng ký Font tiếng Việt ---
// Đảm bảo đường dẫn này TRUY CẬP ĐƯỢC TỪ CLIENT-SIDE (tức là từ thư mục public)
Font.register({ 
    family: 'Tinos', 
    fonts: [
        { src: '/fonts/Tinos-Regular.ttf', fontWeight: 'normal' },
        { src: '/fonts/Tinos-Bold.ttf', fontWeight: 'bold' },
    ],
});

// --- 2. Định nghĩa Styles (Sử dụng font 'Tinos') ---
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Tinos', // SỬ DỤNG FONT ĐÃ ĐĂNG KÝ
    },
    header: {
        fontSize: 10,
        marginBottom: 5,
        textAlign: 'left',
        color: '#000000',
        fontWeight: 'normal', // Đặt lại trọng lượng font để tránh lỗi
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 10,
    },
    section: {
        marginBottom: 8,
        padding: 5,
        border: '1pt solid #000000',
        fontSize: 10,
    },
    text: {
        fontSize: 10,
        marginBottom: 3,
        fontWeight: 'normal', // Đặt lại trọng lượng font để tránh lỗi
    },
    tableContainer: {
        marginTop: 15,
        marginBottom: 15,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderBottom: '1pt solid #000000',
        padding: 4,
        fontSize: 9,
        fontWeight: 'bold', // Chỉ định FontWeight của font Tinos đã đăng ký
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1pt solid #E0E0E0',
        padding: 4,
        fontSize: 9,
        fontWeight: 'normal', // Chỉ định FontWeight của font Tinos đã đăng ký
    },
    colSTT: { width: '8%', textAlign: 'center' }, // Thêm căn giữa cho STT
    colName: { width: '40%' },
    colSL: { width: '10%', textAlign: 'center' },
    colPrice: { width: '21%', textAlign: 'right' },
    colTotal: { width: '21%', textAlign: 'right', fontWeight: 'bold' }, // Chỉ định FontWeight
    
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        marginBottom: 5,
        borderTop: '1pt solid #000000',
        paddingTop: 5,
    },
    totalText: {
        fontSize: 10,
        fontWeight: 'bold', // Chỉ định FontWeight
    },
    signSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
    },
    signature: {
        fontSize: 10,
        textAlign: 'center',
        width: '40%',
    },
    signatureName: {
        marginTop: 100,
        fontSize: 10,
        textAlign: 'center',
        fontWeight: 'bold', // Tên khách hàng in đậm
    }
});


// Format tiền tệ
const formatCurrencyPDF = (amount) => {
    const safeAmount = Math.max(0, amount || 0); 
    return new Intl.NumberFormat('vi-VN', { 
        style: 'decimal', 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(safeAmount) + 'đ';
};

// ... (Component InvoiceDocument giữ nguyên logic) ...
const InvoiceDocument = ({ order }) => {
    const customerName = order.user_name || 'Khách hàng';
    const statusDisplay = order.status === 'paid'||'shipping'||'completed' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN';
    
    // Tạo data cho bảng
    const tableData = order.orderDetails.map((detail) => {
        const lineTotal = detail.unit_price * detail.quantity - (detail.discount * detail.quantity || 0);
        return {
            name: detail.product_name,
            sl: detail.quantity,
            price: detail.unit_price,
            total: lineTotal,
        };
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                
                {/* 1. Header Công ty */}
                <View>
                    <Text style={{ ...styles.header, fontWeight: 'bold' }}>Công ty TNHH Đá quý Tieera, Đồ án chuyên ngành A</Text>
                    <Text style={styles.header}>Địa chỉ: Cơ sở Quang Trung trường đại học Hoa Sen, quận Gò Vấp TP.HCM</Text>
                </View>

                {/* 2. Tiêu đề Hóa đơn */}
                <Text style={styles.title}>Hóa đơn bán hàng</Text>
                
                {/* Ngày mua hàng */}
                <Text style={{ ...styles.text, marginBottom: 5 }}>
                    Ngày mua hàng: {new Date(order.order_date).toLocaleDateString('vi-VN')}
                </Text>

                {/* 3. Thông tin Khách hàng */}
                <View style={styles.section}>
                    <Text style={styles.text}>Họ tên khách hàng: {customerName}</Text>
                    <Text style={styles.text}>Địa chỉ: {order.shipping_address}</Text>
                    <Text style={styles.text}>Phương thức thanh toán: {order.payment_method}</Text>
                </View>

                {/* 4. Bảng Chi tiết Sản phẩm */}
                <View style={styles.tableContainer}>
                    {/* Header Bảng */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.colSTT}>STT</Text>
                        <Text style={styles.colName}>Tên hàng hóa</Text>
                        <Text style={styles.colSL}>SL</Text>
                        <Text style={styles.colPrice}>Đơn giá</Text>
                        <Text style={styles.colTotal}>Thành tiền</Text>
                    </View>

                    {/* Dữ liệu Bảng */}
                    {tableData.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.colSTT}>{index + 1}</Text>
                            <Text style={styles.colName}>{item.name}</Text>
                            <Text style={styles.colSL}>{item.sl}</Text>
                            <Text style={styles.colPrice}>{formatCurrencyPDF(item.price)}</Text>
                            <Text style={styles.colTotal}>{formatCurrencyPDF(item.total)}</Text>
                        </View>
                    ))}
                </View>

                {/* 5. Tổng tiền và Trạng thái */}
                <View style={styles.totalContainer}>
                    <View style={{ width: '40%', alignItems: 'flex-end' }}>
                        <Text style={styles.totalText}>Tổng tiền đơn hàng:</Text>
                    </View>
                    <View style={{ width: '21%', alignItems: 'flex-end' }}>
                        <Text style={styles.totalText}>{formatCurrencyPDF(order.total_amount)}</Text>
                    </View>
                </View>
                
                <Text style={{ ...styles.title, fontSize: 12, marginTop: 5, textAlign: 'left' }}>
                    {statusDisplay}
                </Text>

                {/* 6. Ký tên */}
                <View style={styles.signSection}>
                    <View style={styles.signature}>
                        <Text>Người mua hàng</Text>
                        <Text>(ký, ghi rõ họ tên)</Text>
                        <Text style={styles.signatureName}>{customerName}</Text>
                    </View>
                    <View style={styles.signature}>
                        <Text>Người bán hàng</Text>
                        <Text>(ký, ghi rõ họ tên)</Text>
                    </View>
                </View>

            </Page>
        </Document>
    );
};

export default InvoiceDocument;