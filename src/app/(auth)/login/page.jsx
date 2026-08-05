"use client";
import React from "react";
import background from "../../../assets/images/background.png";
import logo from "../../../assets/images/logo.png";
import Image from "next/image";
import loginImage from "../../../assets/images/tay.png";
import googleIcon from "../../../assets/images/google_icon.png";
import Link from "next/link";
import { useLogin } from "../../../hook/useLogin";
import { useAuth } from "../../../hook/useAuth";
import { useRedirect } from "../../../hook/useRedirect";
import { useRefresh } from "../../../hook/useRefresh";
import useViewport from "../../../hook/useViewport";

export default function Page() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { user, loading, error, handleLogin, handleGoogleLogin } = useLogin();
  const [isClick, setIsClick] = React.useState(false);
  const { width } = useViewport();
  const isLaptop = width > 1024;
  const isTablet = width > 480 && width <= 1024;
  const isMobile = width <= 480;
  // useRefresh()
  useAuth();
  useRedirect();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }
    await handleLogin({ email, password });
  };

  if (isLaptop) {
    return (
      <div className="w-full h-screen flex justify-center items-center relative">
        {/* Background */}
        <img
          src={background.src}
          alt="background"
          className="absolute w-full h-full top-0 left-0 object-cover"
        />

        {/* Container */}
        <div className="flex flex-row justify-between w-[1000px] h-[800px] bg-white absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] rounded-[20px] shadow-lg">
          {/* Left side (form) */}
          <div className="flex flex-col items-center justify-center w-[464px] h-full relative">
            <Link href="/">
              <Image width={200} height={150} src={logo.src} alt="logo" />
            </Link>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center"
            >
              {/* Email */}
              <label htmlFor="email" className="mb-4">
                <input
                  type="text"
                  placeholder="Nhập tài khoản"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-[19px] w-[350px] h-[60px] bg-[#F3F3F3] rounded-[10px] outline-none"
                />
              </label>

              {/* Password */}
              <label htmlFor="password">
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-[19px] w-[350px] h-[60px] bg-[#F3F3F3] rounded-[10px] outline-none"
                />
              </label>

              {/* Remember me */}
              <label
                htmlFor="remember"
                className="w-[350px] flex items-center justify-start mt-[13px]"
              >
                <input
                  type="checkbox"
                  name="remember"
                  className="accent-[#9B8D6F] mr-[3px] cursor-pointer"
                />
                <span className="text-[#9B8D6F] text-[14px]">Nhớ mật khẩu</span>
              </label>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-[350px] h-[60px] mt-[69px] rounded-[10px] text-white cursor-pointer ${
                  loading
                    ? "bg-[#c4b89f] cursor-not-allowed"
                    : "bg-[#9B8D6F] hover:bg-[#8b7d63]"
                }`}
                onClick={() => setIsClick(true)}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            {/* Error message */}
            {isClick && error && (
              <p className="text-red-500 text-sm mt-3">Lỗi: {error}</p>
            )}

            {/* Or separator */}
            <div className="relative flex justify-center w-full h-[22px] mt-[21px] mb-[21px]">
              <div className="w-8 absolute z-2 bg-white text-center text-[15px] text-[#9B8D6F]">
                or
              </div>
              <hr className="absolute border w-[242px] h-px top-[50%] z-1" />
            </div>
            <div className=""></div>
            {/* Google login */}
            <button
              onClick={handleGoogleLogin}
              className="w-[350px] h-[60px] border border-[#9B8D6F] rounded-[10px] flex flex-row justify-center items-center gap-2 hover:bg-[#f5f5f5] transition cursor-pointer"
            >
              <Image
                src={googleIcon.src}
                width={30}
                height={30}
                alt="google icon"
              />
              <span>Đăng nhập với Google</span>
            </button>

            {/* Register link */}
            <div className="w-full text-center mt-4 text-sm flex flex-col items-center gap-2">
              <div>
                Bạn chưa có tài khoản?{" "}
                <Link href="/register">
                  <span className="cursor-pointer text-[#9B8D6F] font-bold">
                    Đăng ký
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

          {/* Right side (image) */}
          <div className="w-[536px] h-full flex">
            <img
              src={loginImage.src}
              alt="background"
              className="w-full h-full rounded-tr-[20px] rounded-br-[20px] object-cover"
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
          {/* Left (form) */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-8">
            <Link href="/">
              <Image width={150} height={100} src={logo.src} alt="logo" />
            </Link>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center mt-6 w-full"
            >
              <label
                htmlFor="email"
                className="mb-4 w-full flex justify-center"
              >
                <input
                  type="text"
                  placeholder="Nhập tài khoản"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-4 w-full max-w-xs h-14 bg-[#F3F3F3] rounded-[10px] outline-none text-sm"
                />
              </label>

              <label
                htmlFor="password"
                className="w-full flex justify-center mb-1"
              >
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-4 w-full max-w-xs h-14 bg-[#F3F3F3] rounded-[10px] outline-none text-sm"
                />
              </label>

              <label
                htmlFor="remember"
                className="w-full max-w-xs flex items-center justify-start mt-3 text-xs"
              >
                <input
                  type="checkbox"
                  name="remember"
                  className="accent-[#9B8D6F] mr-1.5 cursor-pointer"
                />
                <span className="text-[#9B8D6F]">Nhớ mật khẩu</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className={`w-full max-w-xs h-14 mt-8 rounded-[10px] text-white cursor-pointer text-sm ${
                  loading
                    ? "bg-[#c4b89f] cursor-not-allowed"
                    : "bg-[#9B8D6F] hover:bg-[#8b7d63]"
                }`}
                onClick={() => setIsClick(true)}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            {isClick && error && (
              <p className="text-red-500 text-xs mt-3 text-center">
                Lỗi: {error}
              </p>
            )}

            <div className="relative flex justify-center w-full h-[22px] mt-5 mb-5">
              <div className="w-8 absolute z-20 bg-white text-center text-xs text-[#9B8D6F]">
                or
              </div>
              <hr className="absolute border w-[220px] h-px top-[50%] z-10" />
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full max-w-xs h-14 border border-[#9B8D6F] rounded-[10px] flex flex-row justify-center items-center gap-2 hover:bg-[#f5f5f5] transition cursor-pointer text-sm"
            >
              <Image
                src={googleIcon.src}
                width={26}
                height={26}
                alt="google icon"
              />
              <span>Đăng nhập với Google</span>
            </button>

            <div className="w-full text-center mt-4 text-sm flex flex-col items-center gap-2">
              <div>
                Bạn chưa có tài khoản?{" "}
                <Link href="/register">
                  <span className="cursor-pointer text-[#9B8D6F] font-bold">
                    Đăng ký
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

          {/* Right (image) */}
          <div className="hidden md:flex w-1/2">
            <img
              src={loginImage.src}
              alt="login"
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
        {/* Background mờ nhẹ cho mobile */}
        <img
          src={background.src}
          alt="background"
          className="absolute w-full h-full top-0 left-0 object-cover opacity-80"
        />

        {/* Container */}
        <div className="relative z-10 w-full max-w-md bg-white/95 rounded-2xl shadow-lg px-5 py-6 flex flex-col items-center">
          <Link href="/">
            <Image width={130} height={90} src={logo.src} alt="logo" />
          </Link>

          {/* Ảnh minh hoạ nhỏ phía trên form (tuỳ thích, có thể bỏ) */}
          <div className="w-full flex justify-center mt-4 mb-2">
            {/* <img
              src={loginImage.src}
              alt="login"
              className="w-full max-w-xs h-[200px] rounded-xl object-cover"
            /> */}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center mt-4 w-full"
          >
            <label htmlFor="email" className="mb-3 w-full flex justify-center">
              <input
                type="text"
                placeholder="Nhập tài khoản"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-3 w-full h-[50px] bg-[#F3F3F3] rounded-[10px] outline-none text-sm"
              />
            </label>

            <label
              htmlFor="password"
              className="w-full flex justify-center mb-1"
            >
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-3 w-full h-[50px] bg-[#F3F3F3] rounded-[10px] outline-none text-sm"
              />
            </label>

            <label
              htmlFor="remember"
              className="w-full flex items-center justify-start mt-2 text-xs"
            >
              <input
                type="checkbox"
                name="remember"
                className="accent-[#9B8D6F] mr-1.5 cursor-pointer"
              />
              <span className="text-[#9B8D6F]">Nhớ mật khẩu</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-[50px] mt-6 rounded-[10px] text-white cursor-pointer text-sm ${
                loading
                  ? "bg-[#c4b89f] cursor-not-allowed"
                  : "bg-[#9B8D6F] hover:bg-[#8b7d63]"
              }`}
              onClick={() => setIsClick(true)}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          {isClick && error && (
            <p className="text-red-500 text-xs mt-3 text-center">
              Lỗi: {error}
            </p>
          )}

          <div className="relative flex justify-center w-full h-5 mt-4 mb-4">
            <div className="w-8 absolute z-20 bg-white/95 text-center text-xs text-[#9B8D6F]">
              or
            </div>
            <hr className="absolute border w-[200px] h-px top-[50%] z-10" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full h-[50px] border border-[#9B8D6F] rounded-[10px] flex flex-row justify-center items-center gap-2 hover:bg-[#f5f5f5] transition cursor-pointer text-sm"
          >
            <Image
              src={googleIcon.src}
              width={24}
              height={24}
              alt="google icon"
            />
            <span>Đăng nhập với Google</span>
          </button>

          <div className="w-full text-center mt-4 text-sm flex flex-col items-center gap-2">
            <div>
              Bạn chưa có tài khoản?{" "}
              <Link href="/register">
                <span className="cursor-pointer text-[#9B8D6F] font-bold">
                  Đăng ký
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

  // fallback
  return null;
}
