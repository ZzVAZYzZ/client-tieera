"use client";
import React from "react";
import backIcon from "../../../assets/images/backicon.png";
import Image from "next/image";
import Link from "next/link";
import UserIcon from "../../../assets/icons/user_icon";
import { useDispatch, useSelector } from "react-redux";
import PenIcon from "../../../assets/icons/pen_icon";
import { updateProfile, uploadAvatar } from "../../../redux/features/userSlice";
import { useAuth } from "../../../hook/useAuth";

export default function Page() {
  const dispatch = useDispatch();
  const { user, updateProfileStatus, uploadAvatarStatus } = useSelector(
    (state) => state.user
  );

  useAuth();

  const [isEditing, setIsEditing] = React.useState(false);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [avatarPreview, setAvatarPreview] = React.useState(null);
  const [notice, setNotice] = React.useState({ message: "", type: "success" });

  const fileInputRef = React.useRef(null);
  const nameInputRef = React.useRef(null);

  React.useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const clickEdit = () => {
    setIsEditing(true);
    setNotice({ message: "", type: "success" });
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  };

  const handleBlurName = () => {
    setIsEditingName(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setNotice({ message: "", type: "success" });

    try {
      await dispatch(uploadAvatar(file)).unwrap();
      setNotice({ message: "Cập nhật ảnh đại diện thành công.", type: "success" });
    } catch (err) {
      setNotice({
        message:
          typeof err === "string" ? err : "Cập nhật ảnh đại diện thất bại.",
        type: "error",
      });
      setAvatarPreview(user?.avatar || null);
    }
  };

  const handleSave = async () => {
    setNotice({ message: "", type: "success" });

    try {
      await dispatch(updateProfile({ name, email, phone, address })).unwrap();
      setIsEditing(false);
      setIsEditingName(false);
      setNotice({ message: "Đã lưu thông tin.", type: "success" });
    } catch (err) {
      setNotice({
        message: typeof err === "string" ? err : "Lưu thông tin thất bại.",
        type: "error",
      });
    }
  };

  const isSaving = updateProfileStatus === "loading";
  const isUploading = uploadAvatarStatus === "loading";

  return (
    <div className="bg-[#E4E4E4] flex justify-center items-center min-h-screen">
      <div className="w-[1100px] min-h-[800px] bg-white mt-[67px] mb-[67px] flex relative flex-col items-center py-[50px] rounded-lg shadow-md">
        <Link href="/" className="absolute top-[37px] left-9 cursor-pointer">
          <Image priority src={backIcon} width={25} height={25} alt="back icon" />
        </Link>

        <div className="w-[500px] flex flex-col items-center">
          <div className="border rounded-full w-[150px] h-[150px] overflow-hidden flex items-center justify-center">
            {avatarPreview ? (
              <Image
                width={150}
                height={150}
                src={avatarPreview}
                alt="avatar"
                className="object-cover w-[150px] h-[150px]"
              />
            ) : (
              <UserIcon width={150} height={150} />
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

          <div className="text-[32px] mt-2.5">
            {isEditingName ? (
              <input
                ref={nameInputRef}
                className="border-b border-gray-400 text-center outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleBlurName}
              />
            ) : (
              <b>{name || "Username"}</b>
            )}
          </div>

          <div className="flex flex-col items-center mt-5">
            {isEditing ? (
              <>
                <button
                  onClick={handleEditName}
                  className="flex items-center justify-center w-[100px] h-[35px] bg-[#D9D9D9] text-[15px] cursor-pointer rounded-sm mb-2.5"
                >
                  Sửa tên
                </button>
                <button
                  onClick={handleAvatarClick}
                  disabled={isUploading}
                  className={`flex items-center justify-center w-[230px] h-[35px] bg-[#D9D9D9] text-[15px] cursor-pointer rounded-sm mb-5 ${
                    isUploading ? "opacity-60 cursor-wait" : ""
                  }`}
                >
                  {isUploading ? "Đang tải ảnh..." : "Cập nhật ảnh đại diện"}
                </button>
              </>
            ) : (
              <button
                onClick={clickEdit}
                className="flex items-center justify-center w-[260px] h-10 bg-[#D9D9D9] text-[15px] cursor-pointer rounded-sm mb-5"
              >
                Chỉnh sửa thông tin người dùng
              </button>
            )}
          </div>

          <div className="flex flex-col gap-[25px] w-full">
            <div className="w-full">
              <span className="text-[24px]">Email</span>
              {isEditing ? (
                <div className="w-[500px] h-[50px] border font-thin px-[18px] relative flex items-center">
                  <input
                    className="w-full h-full outline-none pr-10"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <PenIcon width={18} height={18} />
                  </div>
                </div>
              ) : (
                <div className="w-[500px] h-[50px] border leading-[50px] font-thin px-[18px]">
                  <span>{user?.email || "Chưa có email"}</span>
                </div>
              )}
            </div>

            <div className="w-full">
              <span className="text-[24px]">Số điện thoại</span>
              {isEditing ? (
                <div className="w-[500px] h-[50px] border font-thin px-[18px] relative flex items-center">
                  <input
                    className="w-full h-full outline-none pr-10"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <PenIcon width={18} height={18} />
                  </div>
                </div>
              ) : (
                <div className="w-[500px] h-[50px] border leading-[50px] font-thin px-[18px]">
                  <span>{user?.phone || "Chưa có số điện thoại"}</span>
                </div>
              )}
            </div>

            <div className="w-full">
              <span className="text-[24px]">Địa chỉ</span>
              {isEditing ? (
                <div className="w-[500px] h-[50px] border font-thin px-[18px] relative flex items-center">
                  <input
                    className="w-full h-full outline-none pr-10"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <PenIcon width={18} height={18} />
                  </div>
                </div>
              ) : (
                <div className="w-[500px] h-[50px] border leading-[50px] font-thin px-[18px]">
                  <span>{user?.address || "Chưa có địa chỉ"}</span>
                </div>
              )}
            </div>
          </div>

          {notice.message && (
            <p
              className={`text-sm mt-4 ${
                notice.type === "error" ? "text-red-600" : "text-green-700"
              }`}
            >
              {notice.message}
            </p>
          )}

          {isEditing && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center w-[180px] h-[45px] bg-[#9B8D6F] text-white mt-[50px] rounded-md cursor-pointer hover:bg-[#8A7E63] transition-all disabled:opacity-60 disabled:cursor-wait"
            >
              {isSaving ? "Đang lưu..." : "LƯU THÔNG TIN"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
