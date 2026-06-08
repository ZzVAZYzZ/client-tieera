import LichIcon from "../../../assets/icons/admin/lich_icon";
import React, { useEffect, useState } from "react";

// @param { mode,onChangeMode,selectedDate, onSelectDay, calendarMonth, calendarYear, onChangeMonth,}
// @result  nav
const NavStatistical = ({
  mode,
  onChangeMode,
  selectedDate,      // { day, month, year } | null
  onSelectDay,       // (day: number) => void
  calendarMonth,     // number 0-11
  calendarYear,      // number
  onChangeMonth,     // (offset: -1 | 1) => void
}) => {
  const today = new Date();

  const months = [
    "Jan",  
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Ngày hiển thị ở ô bên trái (nếu chưa chọn ngày thì dùng hôm nay)
  const dateToShow = selectedDate
    ? selectedDate
    : {
        day: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
      };

  useEffect(()=>{console.log(dateToShow);},[dateToShow])
  const [openCalendar, setOpenCalendar] = useState(false);

  const baseBtn =
    "w-[200px] h-[45px] shadow-[0px_4px_15px_rgba(0,0,0,0.4)] rounded-lg flex justify-center items-center gap-[5px] cursor-pointer text-[15px]";
  const activeBtn = "bg-[#9B8D6F] text-white";
  const inactiveBtn = "bg-[#E0DED9] text-black";

  // @param null
  // @result mở / đóng popup lịch
  const handleToggleCalendar = () => {
    setOpenCalendar((prev) => !prev);
  };

  // @param {d} 
  // @result chọn ngày và đóng popup lịch
  const handleSelectDay = (d) => {
    onSelectDay(d);
    setOpenCalendar(false);
  };

  // số ngày của tháng đang xem
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

  return (
    <header className="w-full h-[70px] bg-white rounded-[10px] flex flex-row justify-between items-center px-[25px] py-3">
      {/* Ô hiển thị ngày + lịch */}
      <div className="relative">
        <button
          type="button"
          onClick={handleToggleCalendar}
          className="w-[120px] h-[45px] bg-[#9B8D6F] shadow-[0px_4px_15px_rgba(0,0,0,0.4)] rounded-lg flex justify-center items-center text-white text-[15px] gap-0.5"
        >
          <div className="cursor-context-menu">
            {dateToShow.day},{months[dateToShow.month]}
          </div>
          <LichIcon />
        </button>

        {/* POPUP LỊCH */}
        {openCalendar && (
          <div className="absolute top-[52px] left-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-[230px]">
            {/* Header tháng với nút trái / phải */}
            <div className="flex items-center justify-between mb-2 text-sm">
              <button
                type="button"
                className="px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => onChangeMonth(-1)}
              >
                ‹
              </button>
              <div className="font-semibold">
                Tháng {calendarMonth + 1} / {calendarYear}
              </div>
              <button
                type="button"
                className="px-2 py-1 rounded hover:bg-gray-100"
                onClick={() => onChangeMonth(1)}
              >
                ›
              </button>
            </div>

            {/* Header thứ */}
            <div className="grid grid-cols-7 gap-1 text-xs mb-1 text-gray-500">
              <div>T2</div>
              <div>T3</div>
              <div>T4</div>
              <div>T5</div>
              <div>T6</div>
              <div>T7</div>
              <div>CN</div>
            </div>

            {/* ngày trong tháng (simple: 1 -> daysInMonth) */}
            <div className="grid grid-cols-7 gap-1 text-sm">
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = i + 1;
                const isSelected =
                  selectedDate &&
                  selectedDate.day === d &&
                  selectedDate.month === calendarMonth &&
                  selectedDate.year === calendarYear;

                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleSelectDay(d)}
                    className={`w-7 h-7 flex items-center justify-center rounded-full
                      ${
                        isSelected
                          ? "bg-[#9B8D6F] text-white"
                          : "hover:bg-gray-200"
                      }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Nút theo tháng / theo năm */}
      <div className="flex flex-row gap-[25px] items-center">
        
        <button
          type="button"
          className={`${baseBtn} ${
            mode === "month" ? activeBtn : inactiveBtn
          }`}
          onClick={() => onChangeMode("month")}
        >
          <div>Theo tháng</div>
        </button>

        <button
          type="button"
          className={`${baseBtn} ${mode === "year" ? activeBtn : inactiveBtn}`}
          onClick={() => onChangeMode("year")}
        >
          <div>Theo năm</div>
        </button>
      </div>
    </header>
  );
};

export default NavStatistical;
