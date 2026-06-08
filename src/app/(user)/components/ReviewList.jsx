"use client";
import React, { useEffect, useState } from "react";
import StarIcon from "../../../assets/icons/star_icon";
import { useReview } from "../../../hook/useReview";
import { useSelector } from "react-redux";

export default function ReviewList({ productId, prop }) {
  const { getReviewsByProduct } = useReview();
  const [reviews, setReviews] = useState([]);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        const data = await getReviewsByProduct(productId);
         const sorted =
          Array.isArray(data) && data.length > 0
            ? [...data].sort(
                (a, b) =>
                  new Date(b.created_at || b.date || 0) -
                  new Date(a.created_at || a.date || 0)
              )
            : [];
        setReviews(sorted);
      } catch (err) {
        console.error("❌ Lỗi tải đánh giá:", err);
      }
    })();
  }, [productId]);

  // useEffect(() => {
  //   console.log(prop);
  // }, [prop]);

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  return (
    <div className="mt-4">
      {reviews.length === 0 ? (
        <>
          {prop ? (
            <>
              <div className="flex flex-col gap-6">
                <div className="border-b pb-4 flex items-center gap-4">
                  <div className="w-[70px] h-[70px] rounded-full bg-gray-200 flex items-center justify-center text-[20px] font-semibold text-gray-600 shrink-0">
                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>

                  <div className="flex w-full items-start justify-between">
                    <div className="w-[200px] shrink-0">
                      <h3 className="font-semibold text-[24px] text-[#333] truncate">
                        {user.name}
                      </h3>
                    </div>

                    <div className="flex-1 px-4">
                      <p className="text-gray-700 text-[20px] leading-relaxed wrap-break-word">
                        {prop?.comment}
                      </p>
                    </div>

                    <div className="w-[130px] flex justify-end">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          size={30}
                          color={i < prop?.rating ? "#FACC15" : "#D1D5DB"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic text-[16px]">
              Chưa có đánh giá nào
            </p>
          )}
        </>
      ) : (
        /*  */
        <>
          <p className="text-[16px] text-gray-600 mb-4">
            Hiện có <strong>{reviews.length}</strong> đánh giá
          </p>
          {prop ? (
            <>
              <div className="flex flex-col gap-6 mb-6">
                <div className="border-b pb-4 flex items-center gap-4">
                  <div className="w-[70px] h-[70px] rounded-full bg-gray-200 flex items-center justify-center text-[20px] font-semibold text-gray-600 shrink-0">
                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>

                  <div className="flex w-full items-start justify-between">
                    <div className="w-[200px] shrink-0">
                      <h3 className="font-semibold text-[24px] text-[#333] truncate">
                        {user.name}
                      </h3>
                    </div>

                    <div className="flex-1 px-4">
                      <p className="text-gray-700 text-[20px] leading-relaxed wrap-break-word">
                        {prop?.comment}
                      </p>
                    </div>

                    <div className="w-[130px] flex justify-end">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          size={30}
                          color={i < prop?.rating ? "#FACC15" : "#D1D5DB"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
          <div className="flex flex-col gap-6">
            {reviews.map((item) => (
              <div
                key={item.review_id}
                className="border-b pb-4 flex items-center gap-4"
              >
                {/* 🧑 Avatar */}
                <div className="w-[70px] h-[70px] rounded-full bg-gray-200 flex items-center justify-center text-[20px] font-semibold text-gray-600 shrink-0">
                  {item.user_name?.charAt(0)?.toUpperCase() || "?"}
                </div>

                {/* 📋 Nội dung chia 3 cột */}
                <div className="flex w-full items-start justify-between">
                  {/* 👤 Tên người dùng */}
                  <div className="w-[200px] shrink-0">
                    <h3 className="font-semibold text-[24px] text-[#333] truncate">
                      {item.user_name}
                    </h3>
                  </div>

                  {/* 💬 Bình luận */}
                  <div className="flex-1 px-4">
                    <p className="text-gray-700 text-[20px] leading-relaxed wrap-break-word">
                      {item.comment}
                    </p>
                  </div>

                  {/* ⭐ Số sao */}
                  <div className="w-[130px] flex justify-end">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        size={30}
                        color={i < item.rating ? "#FACC15" : "#D1D5DB"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
