"use client";

import React, { useState, useEffect } from "react";
import { useFetchProducts } from "../../../hook/useFetchProducts";
import NavPage from "../components/navPage";
import BachamIcon from "../../../assets/icons/admin/bacham_icon";
import Link from "next/link";
import useFetchProductById from "../../../hook/useGetProductById";
import useDeleteProduct from "../../../hook/useDeleteProduct";
import { useReview } from "../../../hook/useReview";
import ReviewModal from "./components/ReviewModal";

export default function Page() {
  const { products, status } = useFetchProducts();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const { fetchProductById } = useFetchProductById();
  const { deleteProductById, deletingProduct } = useDeleteProduct();

  const { getReviewsByProduct } = useReview();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewList, setReviewList] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Format date
  function formatDateVN(dateString) {
    if (!dateString) return "--/--/----";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  }

  useEffect(()=>{
    console.log(products);
  },[products])

  function removeAccents(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

  // Lọc sản phẩm theo search
const normalizedSearch = removeAccents(searchTerm.trim().toLowerCase());

const filteredProducts =
  status === "successed" && Array.isArray(products)
    ? products.filter((item) => {
        const name = removeAccents((item.name || "").toLowerCase());
        const id = removeAccents(String(item.product_id || "").toLowerCase());

        // format ngày giống UI
        const createdDate = formatDateVN(item.created_at) || "";
        const createdSearch = removeAccents(
          createdDate.toLowerCase()
        );

        return (
          name.includes(normalizedSearch) ||
          id.includes(normalizedSearch) ||
          createdSearch.includes(normalizedSearch)
        );
      })
    : [];




  // Open Review Modal
  //@param {object} product - sản phẩm được chọn
  //@result {Promise<void>}
  const handleOpenReviewModal = async (product) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
    setReviewList([]);
    setReviewsError("");
    setReviewsLoading(true);
    setOpenMenuIndex(null);

    try {
      const data = await getReviewsByProduct(product.product_id);

      const sorted = Array.isArray(data)
        ? [...data].sort(
            (a, b) =>
              new Date(b.created_at || b.createdAt) -
              new Date(a.created_at || a.createdAt)
          )
        : [];

      setReviewList(sorted);
    } catch (e) {
      setReviewsError("Không thể tải danh sách đánh giá.");
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedProduct(null);
  };

  // Đóng menu khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".product-row")) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col ml-2.5 gap-3">
      {deletingProduct && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 flex justify-center items-center">
          <div className="w-14 h-14 border-4 border-[#9B8D6F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <NavPage searchTerm={searchTerm} onSearchChange={setSearchTerm}/>

      <div className="w-full h-full bg-white rounded-[10px] flex flex-col px-[72px] pt-[52px] pb-[47px] relative">
        {/* Wrapper có thể cuộn */}
        <div className="w-full flex flex-col">
          {/* Header */}
          <div className="w-full min-h-[50px] flex flex-row items-center">
            <div className="w-[7%]">Stt</div>
            <div className="w-[19%]">Sản phẩm</div>
            <div className="w-[13%]">Ngày tạo</div>
            <div className="w-[21%]">Tồn kho</div>
            {/* <div className="w-[20%]">Lượt bình luận/đánh giá</div> */}
            <div className="w-[20%]">Trạng thái tạo sản phẩm</div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="flex flex-col h-[500px] overflow-y-auto gap-[7px]">
            {status === "successed" &&
              filteredProducts?.map((item, index) => (
                <div
                  key={index}
                  className="product-row relative flex flex-row w-full bg-[#EDEDED] min-h-20 rounded-lg items-center pl-4 pr-10"
                >
                  <div className="w-[5%]">{index + 1}</div>
                  <div
                    className="w-[21%] font-medium truncate"
                    title={item.name}
                  >
                    {item.name}
                  </div>
                  <div className="w-[17%]">{formatDateVN(item.created_at)}</div>
                  <div className="w-[27%]">{item.stock_quantity}</div>
                  {/* <div className="w-[25%]">
                    {item.reviews_count || 0} đánh giá
                  </div> */}
                  <div className="w-[30%] text-green-600">{item.status}</div>

                  {/* Menu 3 chấm */}
                  <div
                    className="w-[4%] cursor-pointer relative flex justify-end"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuIndex(openMenuIndex === index ? null : index);
                    }}
                  >
                    <BachamIcon />

                    {openMenuIndex === index && (
                      <div className="absolute right-0 top-full mt-2 w-[200px] bg-white shadow-lg rounded-md border border-gray-200 z-10">
                        <Link href={`/dashboard/update/${item.product_id}`}>
                          <button
                            onClick={() => fetchProductById(item.product_id)}
                            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left text-sm"
                          >
                            ✏️ Chỉnh sửa sản phẩm
                          </button>
                        </Link>

                        <button
                          onClick={() => deleteProductById(item.product_id)}
                          className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left text-sm text-red-600"
                        >
                          🗑️ Xóa sản phẩm
                        </button>

                        <button
                          onClick={() => handleOpenReviewModal(item)}
                          className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left text-sm"
                        >
                          👁️ Xem đánh giá
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* REVIEW MODAL */}
        {showReviewModal && selectedProduct && (
          <ReviewModal
            selectedProduct={selectedProduct}
            reviewList={reviewList}
            reviewsLoading={reviewsLoading}
            reviewsError={reviewsError}
            onClose={handleCloseReviewModal}
          />
        )}
      </div>
    </div>
  );
}
