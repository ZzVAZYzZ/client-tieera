"use client";
import React from "react";
import background from "../../../assets/images/background.png";
import logo from "../../../assets/images/logo.png";
import Image from "next/image";
import loginImage from "../../../assets/images/tay.png";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRegister } from "../../../hook/useRegister";
import useViewport from "../../../hook/useViewport";

export default function page() {
  const router = useRouter();
  const { message, loading, error, handleRegister, resetAll } = useRegister();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const { width } = useViewport();
  const isLaptop = width > 1024;
  const isTablet = width > 480 && width <= 1024;
  const isMobile = width <= 480;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(email, password, confirmPassword);
  };
  if (isLaptop) {
    return (
      <div className="w-full h-screen flex justify-center items-center relative">
        <img
          src={background.src}
          alt="background"
          className="absolute w-full h-full top-0 left-0"
        />
        <div className="flex flex-row justify-between w-[1000px] h-[800px] bg-white absolute top-[50%] left-[50%] transform translate-x-[-500px] translate-y-[-400px] rounded-[20px]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center w-[464px] h-full"
          >
            <Image width={200} height={150} src={logo.src} alt="logo" />
            <label htmlFor="email" className="mb-4">
              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-[19px] w-[350px] h-[60px] bg-[#F3F3F3] rounded-[10px]"
              />
            </label>

            <label htmlFor="password" className="mb-4">
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-[19px] w-[350px] h-[60px] bg-[#F3F3F3] rounded-[10px]"
              />
            </label>
            <label htmlFor="repassword">
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-[19px] w-[350px] h-[60px] bg-[#F3F3F3] rounded-[10px]"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-[350px] h-[60px] bg-[#9B8D6F] text-white mt-[69px] rounded-[10px]"
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>

            {/* {message && (
            <p className='text-green-600 mt-3'>
              {typeof message === 'string' ? message : message.message}
            </p>
          )} */}
            {error && (
              <p className="text-red-500 mt-3">
                {typeof error === "string" ? error : error.message}
              </p>
            )}

            <div className="w-full text-center mt-4 text-sm flex flex-col items-center gap-2">
              <div>
                Bạn đã có tài khoản?{" "}
                <Link href="/login">
                  <span className="cursor-pointer text-[#9B8D6F] font-bold">
                    Đăng nhập
                  </span>
                </Link>
              </div>

              <Link href="/home">
                Quay lại
                <span className="cursor-pointer text-[#9B8D6F] font-bold ml-1">
                  Trang Chủ
                </span>
              </Link>
            </div>
          </form>

          <div className="w-[536px] h-full flex">
            <img
              src={loginImage.src}
              alt="background"
              className="w-full h-full rounded-tr-[20px] rounded-br-[20px]"
            />
          </div>
        </div>
      </div>
    );
  }
  // =================== TABLET ===================
  if (isTablet) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center relative px-4 py-6">
        {/* Background */}
        <img
          src={background.src}
          alt="background"
          className="absolute w-full h-full top-0 left-0 object-cover"
        />

        {/* Container */}
        <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-8"
          >
            <Link href="/">
              <Image width={160} height={110} src={logo.src} alt="logo" />
            </Link>

            <label
              htmlFor="email"
              className="mb-4 mt-6 w-full flex justify-center"
            >
              <input
                id="email"
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-4 w-full max-w-xs h-[56px] bg-[#F3F3F3] rounded-[10px] outline-none text-sm"
              />
            </label>

            <label
              htmlFor="password"
              className="mb-4 w-full flex justify-center"
            >
              <input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-4 w-full max-w-xs h-[56px] bg-[#F3F3F3] rounded-[10px] outline-none text-sm"
              />
            </label>

            <label htmlFor="repassword" className="w-full flex justify-center">
              <input
                id="repassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-4 w-full max-w-xs h-[56px] bg-[#F3F3F3] rounded-[10px] outline-none text-sm"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`w-full max-w-xs h-[56px] mt-8 rounded-[10px] text-white cursor-pointer text-sm ${
                loading
                  ? "bg-[#c4b89f] cursor-not-allowed"
                  : "bg-[#9B8D6F] hover:bg-[#8b7d63]"
              }`}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>

            {error && (
              <p className="text-red-500 mt-3 text-xs text-center">
                {typeof error === "string" ? error : error.message}
              </p>
            )}

            <div className="w-full text-center mt-4 text-sm flex flex-col items-center gap-2">
              <div>
                Bạn đã có tài khoản?{" "}
                <Link href="/login">
                  <span className="cursor-pointer text-[#9B8D6F] font-bold">
                    Đăng nhập
                  </span>
                </Link>
              </div>

              <Link href="/home">
                Quay lại
                <span className="cursor-pointer text-[#9B8D6F] font-bold ml-1">
                  Trang Chủ
                </span>
              </Link>
            </div>
          </form>

          {/* Ảnh bên phải (ẩn trên tablet nhỏ nếu muốn) */}
          <div className="hidden md:flex w-1/2">
            <img
              src={loginImage.src}
              alt="background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  // =================== MOBILE ===================
  if (isMobile) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center relative px-4 py-6">
        {/* Background */}
        <img
          src={background.src}
          alt="background"
          className="absolute w-full h-full top-0 left-0 object-cover opacity-80"
        />

        {/* Card */}
        <div className="relative z-10 w-full max-w-md bg-white/95 rounded-2xl shadow-lg px-5 py-6 flex flex-col items-center">
          <Link href="/">
            <Image width={130} height={90} src={logo.src} alt="logo" />
          </Link>

          <div className="w-full flex justify-center mt-4 mb-2">
            {/* <img
              src={loginImage.src}
              alt="register"
              className="w-full max-w-xs rounded-xl object-cover"
            /> */}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center mt-4 w-full"
          >
            <label htmlFor="email" className="mb-3 w-full flex justify-center">
              <input
                id="email"
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-3 w-full h-[50px] bg-[#F3F3F3] rounded-[10px] outline-none text-sm"
              />
            </label>

            <label
              htmlFor="password"
              className="mb-3 w-full flex justify-center"
            >
              <input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-3 w-full h-[50px] bg-[#F3F3F3] rounded-[10px] outline-none text-sm"
              />
            </label>

            <label htmlFor="repassword" className="w-full flex justify-center">
              <input
                id="repassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-3 w-full h-[50px] bg-[#F3F3F3] rounded-[10px] outline-none text-sm"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-[50px] mt-6 rounded-[10px] text-white cursor-pointer text-sm ${
                loading
                  ? "bg-[#c4b89f] cursor-not-allowed"
                  : "bg-[#9B8D6F] hover:bg-[#8b7d63]"
              }`}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          {error && (
            <p className="text-red-500 mt-3 text-xs text-center">
              {typeof error === "string" ? error : error.message}
            </p>
          )}

          <div className="w-full text-center mt-4 text-sm flex flex-col items-center gap-2">
            <div>
              Bạn đã có tài khoản?{" "}
              <Link href="/login">
                <span className="cursor-pointer text-[#9B8D6F] font-bold">
                  Đăng nhập
                </span>
              </Link>
            </div>

            <Link href="/home">
              Quay lại
              <span className="cursor-pointer text-[#9B8D6F] font-bold ml-1">
                Trang Chủ
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // fallback (tránh khi width = 0 lúc đầu)
  return null;
}
