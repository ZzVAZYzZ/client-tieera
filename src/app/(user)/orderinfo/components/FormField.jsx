"use client";
import React from "react";

export default React.memo(function FormField({
  label,
  textarea = false,
  error,
  required,
  className = "",
  ...props
}) {
  const base =
    "w-full rounded-md border px-3 text-[14px] bg-white placeholder-[#9E9E9E] focus:outline-none focus:border-[#9B8D6F]";
  const cls = [
    base,
    error ? "border-red-400" : "border-[#E5E7EB]",
    textarea ? "min-h-[90px] py-2" : "h-[40px]",
    "relative",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-1 relative">
      <div className="relative">
        {textarea ? (
          <textarea {...props} required={required} className={cls} />
        ) : (
          <input
            {...props}
            value={props.value ?? ""} // ✅ ép rỗng đúng chuẩn
            required={required}
            className={cls}
          />
        )}
        {/* Dấu * đỏ hiển thị bên phải placeholder */}
        {/* {required && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none select-none">
            *
          </span>
        )} */}
      </div>
      {error && <span className="text-[12px] text-red-500">{error}</span>}
    </div>
  );
});
