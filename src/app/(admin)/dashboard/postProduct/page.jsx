"use client";
import React, { useRef, useState } from "react";
import useAddProduct from "../../../../hook/usePostProduct";
import "./globals.css";
// import { useAuth } from "../../../../hook/useAuth";

const Page = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    material: "",
    category_id: "",
    price: 1000,
    discount_price: 100,
    stock_quantity: 10,
    status: "active",
    color: "",
    stone_type: "",
    stone_shape: "",
    weight: 0,
    main_index: Number(0),
  });

  const [images, setImages] = useState([null, null, null, null, null]);
  const [errors, setErrors] = useState({});
  const { addProduct, loading } = useAddProduct();

  // 👉 refs cho từng input cần shake
  const refs = {
    name: useRef(null),
    description: useRef(null),
    material: useRef(null),
    color: useRef(null),
    stone_type: useRef(null),
    stone_shape: useRef(null),
    weight: useRef(null),
    category_id: useRef(null),
    price: useRef(null),
    stock_quantity: useRef(null),
  };

  // 👉 Hàm kích hoạt shake
  // @param  ref
  // @result  thêm class "shake" tạm thời cho element để tạo hiệu ứng rung khi lỗi
  const triggerShake = (ref) => {
    if (!ref?.current) return;
    ref.current.classList.add("shake");
    setTimeout(() => ref.current.classList.remove("shake"), 400);
  };

  // @param {Event} e - sự kiện onChange của input file
  // @param {number} index - vị trí ảnh trong mảng images
  // @result  cập nhật file ảnh tương ứng với index
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  // @param  e - sự kiện onChange của input text/number/radio
  // @result cập nhật state form + reset lỗi field đó
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "price" ||
        name === "discount_price" ||
        name === "stock_quantity"
          ? Number(value)
          : value,
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // @param {}
  // @result  true nếu form hợp lệ, false nếu có lỗi; đồng thời set error + trigger shake
  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Vui lòng nhập tên sản phẩm";
    if (!form.description.trim()) newErrors.description = "Vui lòng nhập mô tả";
    if (!form.material) newErrors.material = "Vui lòng chọn chất liệu";
    if (!form.color) newErrors.color = "Vui lòng chọn màu sắc";
    // if (!form.stone_type) newErrors.stone_type = "Vui lòng chọn loại đá";
    // if (!form.stone_shape) newErrors.stone_shape = "Vui lòng chọn hình dạng đá";
    // if (!form.weight) newErrors.weight = "Vui lòng chọn trọng lượng";
    if (!form.category_id)
      newErrors.category_id = "Vui lòng chọn loại sản phẩm";
    if (!form.price || form.price <= 0)
      newErrors.price = "Giá tiền không hợp lệ";
    if (!form.stock_quantity || form.stock_quantity <= 0)
      newErrors.stock_quantity = "Số lượng không hợp lệ";

    setErrors(newErrors);

    // 💡 Chờ render hoàn tất trước khi shake
    setTimeout(() => {
      Object.keys(newErrors).forEach((key) => {
        triggerShake(refs[key]);
      });
    }, 0);

    return Object.keys(newErrors).length === 0;
  };
 // @param null
  // @result  validate form, check ảnh, sau đó gọi API addProduct
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const hasAllImages = images.some((img) => img !== null);
    if (!hasAllImages) {
      alert("Vui lòng tải lên đủ 1 hình ảnh!");
      return;
    }

    await addProduct(form, images);
  };

  return (
    <div className="w-full h-full bg-white rounded-[10px] p-6 flex flex-row gap-6 overflow-auto">
      {/* ================= DIV TRÁI ================= */}
      <div className="w-[65%] flex flex-col gap-6">
        {/* Tên sản phẩm */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Tên sản phẩm</h2>
          <input
            ref={refs.name}
            className={`border rounded-lg px-4 py-2 w-full outline-none focus:border-[#9B8D6F] ${
              errors.name ? "border-red-500" : ""
            }`}
            placeholder="Nhẫn Kim cương"
            type="text"
            name="name"
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Chất liệu & Màu sắc */}
        <div className="flex flex-row gap-6">
          <div className="flex-1">
            <h3 className="font-medium mb-2">Chất liệu</h3>
            <div
              ref={refs.material}
              className={`border rounded-lg p-4 flex flex-col gap-2 ${
                errors.material ? "border-red-500" : ""
              }`}
            >
              <label>
                <input
                  type="radio"
                  name="material"
                  value="vang"
                  onChange={handleChange}
                />{" "}
                Vàng
              </label>
              <label>
                <input
                  type="radio"
                  name="material"
                  value="kim cuong"
                  onChange={handleChange}
                />{" "}
                Kim cương
              </label>
            </div>
            {errors.material && (
              <p className="text-red-500 text-sm mt-1">{errors.material}</p>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium mb-2">Màu sắc</h3>
            <div
              ref={refs.color}
              className={`border rounded-lg p-4 flex flex-col gap-2 ${
                errors.color ? "border-red-500" : ""
              }`}
            >
              <label>
                <input
                  type="radio"
                  name="color"
                  value="trang"
                  onChange={handleChange}
                />{" "}
                Trắng
              </label>
              <label>
                <input
                  type="radio"
                  name="color"
                  value="vang"
                  onChange={handleChange}
                />{" "}
                Vàng
              </label>
              <label>
                <input
                  type="radio"
                  name="color"
                  value="vang hong"
                  onChange={handleChange}
                />{" "}
                Vàng Hồng
              </label>
            </div>
            {errors.color && (
              <p className="text-red-500 text-sm mt-1">{errors.color}</p>
            )}
          </div>
        </div>

        {/* Số lượng & Giá tiền */}
        <div className="flex flex-row gap-6">
          <div className="flex-1">
            <h3 className="font-medium mb-2">Số lượng</h3>
            <input
              ref={refs.stock_quantity}
              className={`border rounded-lg px-4 py-2 w-full outline-none focus:border-[#9B8D6F] ${
                errors.stock_quantity ? "border-red-500" : ""
              }`}
              placeholder="Số lượng"
              type="number"
              name="stock_quantity"
              onChange={handleChange}
            />
            {errors.stock_quantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stock_quantity}
              </p>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium mb-2">Giá tiền</h3>
            <input
              ref={refs.price}
              className={`border rounded-lg px-4 py-2 w-full outline-none focus:border-[#9B8D6F] ${
                errors.price ? "border-red-500" : ""
              }`}
              placeholder="Giá tiền"
              type="number"
              name="price"
              onChange={handleChange}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium mb-2">Giá giảm</h3>
            <input
              type="number"
              name="discount_price"
              onChange={handleChange}
              ref={refs.discount_price}
              className={`border rounded-lg px-4 py-2 w-full outline-none focus:border-[#9B8D6F] ${
                errors.discount_price ? "border-red-500" : ""
              }`}
              placeholder="Giá giảm"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
        </div>
        {/* Loại đá & Hình dạng đá & Trọng lượng */}
        <div className="flex flex-row gap-6">
          <div className="flex-1">
            <h3 className="font-medium mb-2">Loại đá</h3>
            <input
              ref={refs.stone_type}
              className={`border rounded-lg px-4 py-2 w-full outline-none focus:border-[#9B8D6F] ${
                errors.stone_type ? "border-red-500" : ""
              }`}
              placeholder="Loại đá"
              type="text"
              name="stone_type"
              onChange={handleChange}
            />
            {errors.stone_type && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stone_type}
              </p>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium mb-2">Hình dạng đá</h3>
            <input
              ref={refs.stone_shape}
              className={`border rounded-lg px-4 py-2 w-full outline-none focus:border-[#9B8D6F] ${
                errors.price ? "border-red-500" : ""
              }`}
              placeholder="Hình dạng đá"
              type="text"
              name="stone_shape"
              onChange={handleChange}
            />
            {errors.stone_shape && (
              <p className="text-red-500 text-sm mt-1">{errors.stone_shape}</p>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium mb-2">Trọng lượng</h3>
            <input
              type="text"
              name="weight"
              onChange={handleChange}
              ref={refs.weight}
              className={`border rounded-lg px-4 py-2 w-full outline-none focus:border-[#9B8D6F] ${
                errors.weight ? "border-red-500" : ""
              }`}
              placeholder="Trọng lượng"
            />
            {errors.weight && (
              <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
            )}
          </div>
          
        </div>

        {/* Mô tả sản phẩm */}
        <div>
          <h3 className="font-medium mb-2">Mô tả sản phẩm</h3>
          <textarea
            ref={refs.description}
            className={`border rounded-lg p-4 w-full h-[250px] outline-none focus:border-[#9B8D6F] ${
              errors.description ? "border-red-500" : ""
            }`}
            placeholder="Nhập mô tả sản phẩm..."
            name="description"
            onChange={handleChange}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>
      </div>

      {/* ================= DIV PHẢI ================= */}
      <div className="w-[35%] flex flex-col gap-3">
        {/* Hình ảnh */}
        <div>
          <h3 className="font-medium mb-2">Hình ảnh sản phẩm</h3>
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, index) => (
              <label
                key={index}
                className="w-[100px] h-[100px] flex justify-center items-center border rounded-lg cursor-pointer overflow-hidden hover:border-[#9B8D6F]"
              >
                {img ? (
                  <img
                    src={URL.createObjectURL(img)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold">+</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, index)}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Phân loại sản phẩm */}
        <div className="flex flex-col h-[30%]">
          <h3 className="font-medium mb-2">Phân loại sản phẩm</h3>
          <div
            ref={refs.category_id}
            className={`border rounded-lg p-4 flex flex-col gap-2 ${
              errors.category_id ? "border-red-500" : ""
            }`}
          >
            <label>
              <input
                type="radio"
                name="category_id"
                value="3c40c725-8858-487e-9c4f-bc0fff68273d"
                onChange={handleChange}
              />{" "}
              Nhẫn
            </label>
            <label>
              <input
                type="radio"
                name="category_id"
                value="00382bcd-1a1c-474b-8b81-e54313502ab5"
                onChange={handleChange}
              />{" "}
              Dây chuyền
            </label>
            <label>
              <input
                type="radio"
                name="category_id"
                value="4c032dd3-1384-46e4-85f6-c29bbe303605"
                onChange={handleChange}
              />{" "}
              Vòng tay
            </label>
            <label>
              <input
                type="radio"
                name="category_id"
                value="e0f055ec-3ce2-416b-8151-920a20802c0b"
                onChange={handleChange}
              />{" "}
              Bông tai
            </label>
          </div>
          {errors.category_id && (
            <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
          )}
        </div>

        {/* Button tạo sản phẩm */}
        <div className="flex ">
          <button
            onClick={handleSubmit}
            className="w-full bg-[#9B8D6F] cursor-pointer text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Tạo sản phẩm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
