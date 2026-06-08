import React from "react";
import aboutme from "@/assets/images/Screenshot 2026-01-06 180333.png";
import Image from "next/image";

const Page = () => {
  return (
    <div>
      {/* <div className="w-screen h-[50px] bg-[#9B8D6F] flex justify-between items-center my-10">
        <div className="w-[450px] h-5 bg-white"></div>
        <div className="font-bold text-white text-4xl">Về chúng tôi</div>
        <div className="w-[450px] h-5 bg-white"></div>
      </div> */}

      {/* HERO SECTION */}
      <div className="relative w-screen h-screen">
        {/* Background image
        <Image
          src={aboutme.src}
          alt="about"
          fill
          className="object-cover"
        /> */}

        {/* Overlay (tùy chọn) */}
        <div className="absolute inset-0" />
      </div>
    </div>
  );
};

export default Page;
