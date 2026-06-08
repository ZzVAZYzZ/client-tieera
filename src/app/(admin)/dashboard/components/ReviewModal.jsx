"use client";

import { ArrowLeft, Loader2, Star } from "lucide-react";

export default function ReviewModal({
  selectedProduct,
  reviewList,
  reviewsLoading,
  reviewsError,
  onClose,
}) {
  if (!selectedProduct) return null;

  // @param name 
  // @result  ký tự đầu tiên viết hoa, hoặc "?" nếu không có tên
  const getInitial = (name) =>
    name?.trim()?.charAt(0)?.toUpperCase() || "?";

  // @param rating 
  // @result  mảng 5 icon sao, sao vàng tương ứng với rating
  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }).map((_, idx) => (
      <Star
        key={idx}
        size={18}
        stroke={idx < rating ? "#F5C344" : "#D6D6D6"}
        fill={idx < rating ? "#F5C344" : "transparent"}
      />
    ));

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-90"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-center z-100">
        <div className="w-[75%] h-[80%] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden relative">

          {/* Back button */}
          <button
            onClick={onClose}
            className="absolute top-5 left-5 w-10 h-10 bg-[#D3D0CC] rounded-lg flex justify-center items-center hover:bg-[#bcb7b2] transition"
          >
            <ArrowLeft color="white" size={22} />
          </button>

          {/* Title */}
          <div className="w-full text-center mt-6 mb-4">
            <p className="text-[22px] font-semibold text-[#474643]">
              Số lượt đánh giá
            </p>
          </div>

          {/* Content */}
          <div className="w-full h-full px-10 pb-10">
            <div className="w-full h-full bg-[#F4F4F4] rounded-2xl p-8 overflow-y-auto space-y-6">
              {reviewsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 text-[#9B8D6F] animate-spin" />
                </div>
              ) : reviewList.length > 0 ? (
                reviewList.map((review) => (
                  <div
                    key={review.review_id || review._id}
                    className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#E6E6E6] p-6 flex gap-6"
                  >
                    {/* Left column */}
                    <div className="w-1/2 pr-6 border-r border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Thông tin người dùng
                      </p>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-black flex justify-center items-center text-white">
                          {getInitial(review.user_name)}
                        </div>

                        <div className="text-sm flex flex-col text-[#333]">
                          <span className="font-medium">{review.user_name}</span>
                          {/* <span className="text-xs text-gray-500">{review.user_email}</span> */}
                        </div>
                      </div>

                      <p className="text-sm font-medium text-gray-700">Mức độ hài lòng</p>
                      <div className="flex gap-1 mt-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="w-1/2 pl-4 flex flex-col">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Nội dung đánh giá
                      </p>
                      <p className="text-sm text-[#333] leading-relaxed">
                        {review.comment || "Không có nội dung đánh giá."}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 mt-12">
                  Chưa có đánh giá nào cho sản phẩm này.
                </div>
              )}

              {reviewsError && (
                <p className="text-red-500 text-sm">{reviewsError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
