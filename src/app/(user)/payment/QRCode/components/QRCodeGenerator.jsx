import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Khuyên dùng cho môi trường hiện đại

const QRCodeGenerator = ({ dataToEncode }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Mã QR của bạn</h3>
      {dataToEncode ? (
        // Mã hóa dữ liệu (ví dụ: ID đơn hàng)
        <QRCodeSVG 
          value={dataToEncode} 
          size={256} 
          level="H" // Độ chính xác cao
          bgColor="#ffffff"
          fgColor="#000000"
        />
      ) : (
        <p>Không có dữ liệu để mã hóa.</p>
      )}
      <p style={{ marginTop: '10px', fontSize: '12px', wordBreak: 'break-all' }}>
        Dữ liệu mã hóa: **{dataToEncode}**
      </p>
    </div>
  );
};

export default QRCodeGenerator;

// Ví dụ sử dụng: <QRCodeGenerator dataToEncode="ORDER-XYZ-789" />