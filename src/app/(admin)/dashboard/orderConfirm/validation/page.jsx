"use client";
import React from "react";

export default function Page() {
  return (
    <div className="w-full h-full bg-white rounded-[10px] p-6 flex flex-col  items-center gap-6 overflow-auto">
      {/* Tên khách hàng */}
      <div className="w-[70%]">
        <div className=" font-medium text-[24px] mb-3">Tên khách hàng</div>
        <div className=" h-[60px] border leading-[60px] pl-[15px] rounded-lg">
          Tên khách hàng
        </div>
      </div>
      {/* Địa chỉ khách hàng */}
      <div className="w-[70%]">
        <div className=" font-medium text-[24px] mb-3">Địa chỉ khách hàng</div>
        <div className=" h-[360px] border leading-[60px] pl-[15px] rounded-lg">
          Địa chỉ khách hàng
        </div>
      </div>
      {/* Sản phẩm được đặt */}
      <div className="w-[70%]">
        <div className=" font-medium text-[24px] mb-3">Sản phẩm được đặt</div>
        <div className=" h-[150px] border flex flex-row justify-left items-center pl-[15px] rounded-lg gap-3.5">
          <img
            className=" w-[120px] h-[120px] rounded-lg"
            alt="image san pham"
          ></img>
          <p className="text-[24px]">Tên sản phẩm</p>
        </div>
      </div>
      {/* Số lượng + Giá tiền */}
      <div className="w-[70%] flex flex-row justify-between text-[24px]">
        <div className="w-[32%]">
          <div className=" font-medium mb-3">Số lượng</div>
          <div className=" h-[60px] border leading-[60px] pl-[15px] rounded-lg">
            Số lượng sản phẩm
          </div>
        </div>
        <div className="w-[32%]">
          <div className=" font-medium mb-3">Giá tiền</div>
          <div className=" h-[60px] border leading-[60px] pl-[15px] rounded-lg">
            Giá gốc
          </div>
        </div>
        <div className="w-[32%]">
          <div className=" font-medium mb-3">Giá giảm</div>
          <div className=" h-[60px] border leading-[60px] pl-[15px] rounded-lg">
            Giá giảm
          </div>
        </div>
      </div>
      {/* ID đơn hàng */}
      <div className="w-[70%]">
        <div className=" font-medium text-[24px] mb-3">ID đơn hàng</div>
        <div className=" h-[60px] border leading-[60px] pl-[15px] rounded-lg">
          ID đơn hàng
        </div>
      </div>
      {/* Tổng tiền đơn hàng: */}
      <div className="w-[70%] h-[60px] px-[18px] leading-[60px] rounded-lg bg-[#D0E5FF] text-[#1877F2] text-[24px] font-medium flex flex-row justify-between items-center">
        <p>Tổng tiền đơn hàng:</p>
        <p>tổng tiền = giá gốc - giá giảm</p>
      </div>
      {/* Xác nhận đơn hàng */}
      <div className="w-[25%] h-[60px] leading-[60px] text-center text-[24px] text-white bg-[#9B8D6F]">Xác nhận đơn hàng</div>
    </div>
  );
}
