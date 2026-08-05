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
    (state) => state.user,
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

  const clickEdit = () => setIsEditing(true);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));

    try {
      await dispatch(uploadAvatar(file)).unwrap();
      setNotice({ message: "Cập nhật ảnh thành công", type: "success" });
    } catch {
      setNotice({ message: "Upload thất bại", type: "error" });
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(updateProfile({ name, email, phone, address })).unwrap();
      setIsEditing(false);
      setNotice({ message: "Đã lưu", type: "success" });
      setTimeout(() => {
        setNotice({ message: "", type: "success" });
      }, 3000);
    } catch {
      setNotice({ message: "Lỗi lưu", type: "error" });
    }
  };

  const isSaving = updateProfileStatus === "loading";
  const isUploading = uploadAvatarStatus === "loading";

  return (
    <div className="bg-[#E4E4E4] min-h-screen flex justify-center px-4 overflow-x-hidden">
      <div className="w-full max-w-[1100px] bg-white mt-10 mb-10 rounded-lg shadow-md py-8 md:py-12 px-4 md:px-0 relative">
        {/* BACK */}
        <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8">
          <Image src={backIcon} width={25} height={25} alt="back" />
        </Link>

        <div className="w-full max-w-[500px] mx-auto flex flex-col items-center">
          {/* AVATAR */}
          <div
            onClick={handleAvatarClick}
            className="relative w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden cursor-pointer border"
          >
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="avatar"
                fill
                className="object-cover"
              />
            ) : (
              <UserIcon width={150} height={150} />
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleAvatarChange}
          />

          {/* NAME */}
          <div className="text-[20px] md:text-[30px] mt-3 font-semibold text-center">
            {isEditingName ? (
              <input
                ref={nameInputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                className="border-b text-center outline-none"
              />
            ) : (
              name || "Username"
            )}
          </div>

          {/* BUTTON */}
          <div className="mt-4 w-full flex flex-col items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="w-full md:w-[200px] h-[40px] bg-gray-200 rounded-md text-sm"
                >
                  Sửa tên
                </button>

                <button
                  onClick={handleAvatarClick}
                  className="w-full md:w-[200px] h-[40px] bg-gray-200 rounded-md text-sm"
                >
                  {isUploading ? "Đang tải..." : "Đổi avatar"}
                </button>
              </>
            ) : (
              <button
                onClick={clickEdit}
                className="w-full md:w-[250px] h-[40px] bg-gray-200 rounded-md text-sm"
              >
                Chỉnh sửa thông tin người dùng
              </button>
            )}
          </div>

          {/* FORM */}
          <div className="w-full mt-6 space-y-4">
            {/* EMAIL */}
            <div>
              <p className="text-sm md:text-base mb-1">Email</p>
              {isEditing ? (
                <div className="flex items-center border rounded-md px-3 h-[45px]">
                  <input
                    className="flex-1 outline-none text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <PenIcon width={16} height={16} />
                </div>
              ) : (
                <div className="border rounded-md px-3 h-[45px] flex items-center text-sm">
                  {user?.email || "Chưa có"}
                </div>
              )}
            </div>

            {/* PHONE */}
            <div>
              <p className="text-sm md:text-base mb-1">Số điện thoại</p>
              {isEditing ? (
                <div className="flex items-center border rounded-md px-3 h-[45px]">
                  <input
                    className="flex-1 outline-none text-sm"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <PenIcon width={16} height={16} />
                </div>
              ) : (
                <div className="border rounded-md px-3 h-[45px] flex items-center text-sm">
                  {user?.phone || "Chưa có"}
                </div>
              )}
            </div>

            {/* ADDRESS */}
            <div>
              <p className="text-sm md:text-base mb-1">Địa chỉ</p>
              {isEditing ? (
                <div className="flex items-center border rounded-md px-3 h-[45px]">
                  <input
                    className="flex-1 outline-none text-sm"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <PenIcon width={16} height={16} />
                </div>
              ) : (
                <div className="border rounded-md px-3 h-[45px] flex items-center text-sm">
                  {user?.address || "Chưa có"}
                </div>
              )}
            </div>
          </div>

          {/* NOTICE */}
          {notice.message && (
            <p
              className={`mt-4 text-sm ${notice.type === "error" ? "text-red-500" : "text-green-600"}`}
            >
              {notice.message}
            </p>
          )}

          {/* SAVE */}
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full md:w-[180px] h-[45px] bg-[#9B8D6F] text-white mt-6 rounded-md"
            >
              {isSaving ? "Đang lưu..." : "Lưu"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
