"use client";
import React, { useEffect } from "react";
import DgFooterLogo from "../assets/icons/dg_footer_logo";
import FacebookIcon from "../assets/icons/facebook_icon";
import Instagram from "../assets/icons/instagram";
import useViewport from "../hook/useViewport";

const Footer = () => {
  const { width } = useViewport();
  const [isLaptop, setIsLaptop] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (width >= 1024) {
      setIsLaptop(true);
      setIsTablet(false);
      setIsMobile(false);
    } else if (width > 480 && width <= 1024) {
      setIsLaptop(false);
      setIsTablet(true);
      setIsMobile(false);
    } else if (width <= 480) {
      setIsLaptop(false);
      setIsTablet(false);
      setIsMobile(true);
    }
  }, [width]);
  useEffect(() => {
    console.log(width);
  }, [width]);
  if (isLaptop) {
    return (
      <div className="h-[250px] bg-[#9B8D6F] flex flex-row items-center justify-around relative">
        <div className=" flex flex-col text-[white] gap-1">
          <a href="#" className=" text-[24px]">
            OUR COMPANY
          </a>
          <a href="#" className=" opacity-70">
            About us
          </a>
          <a href="#" className=" opacity-70">
            Contact
          </a>
        </div>
        <div className=" flex flex-col text-[white] gap-1">
          <a href="#" className=" text-[24px]">
            SUPPORT
          </a>
          <a href="#" className=" opacity-70">
            Email
          </a>
          <div className=" flex flex-row gap-5">
            <a href="https://www.facebook.com/">
              <FacebookIcon />
            </a>
            <a href="https://www.instagram.com/">
              <Instagram />
            </a>
          </div>
        </div>
        <button className="cursor-pointer scale-90">
          <DgFooterLogo />
        </button>
      </div>
    );
  }
  // ============ TABLET ============
  else if (isTablet) {
    return (
      <div className="bg-[#9B8D6F] px-6 py-8 flex flex-row items-start justify-between gap-4 text-white">
        {/* OUR COMPANY */}
        <div className="flex flex-col gap-1 min-w-[90px]">
          <p className="text-[18px] font-semibold">OUR COMPANY</p>
          <a className="opacity-80 text-sm">About us</a>
          <a className="opacity-80 text-sm">Contact</a>
        </div>

        {/* SUPPORT */}
        <div className="flex flex-col gap-1 min-w-[90px]">
          <p className="text-[18px] font-semibold">SUPPORT</p>
          <a className="opacity-80 text-sm">Email</a>
          <div className="flex gap-3 mt-2">
            <a href="https://facebook.com">
              <FacebookIcon />
            </a>
            <a href="https://instagram.com">
              <Instagram />
            </a>
          </div>
        </div>

        {/* LOGO */}
        <div className="flex items-center">
          <button className="cursor-pointer scale-75">
            <DgFooterLogo />
          </button>
        </div>
      </div>
    );
  }

  // ============ MOBILE ============
  else if (isMobile) {
    return (
      <div className=" bg-[#9B8D6F] px-4 py-7 flex flex-row items-start justify-between gap-3 text-white">
        {/* OUR COMPANY */}
        <div className="flex flex-col gap-1 min-w-20">
          <p className="text-[16px] font-semibold">OUR COMPANY</p>
          <a className="opacity-80 text-xs">About us</a>
          <a className="opacity-80 text-xs">Contact</a>
        </div>

        {/* SUPPORT */}
        <div className="flex flex-col gap-1 min-w-20">
          <p className="text-[16px] font-semibold">SUPPORT</p>
          <a className="opacity-80 text-xs">Email</a>
          <div className="flex gap-2 mt-2">
            <a href="https://facebook.com">
              <FacebookIcon />
            </a>
            <a href="https://instagram.com">
              <Instagram />
            </a>
          </div>
        </div>

        {/* LOGO */}
        <div className="flex items-center">
          <button className="cursor-pointer scale-50">
            <DgFooterLogo />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Footer;
