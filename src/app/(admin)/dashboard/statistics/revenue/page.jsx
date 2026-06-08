"use client";

import jsPDF from "jspdf";

// Xóa import jsPDF
import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import NavStatistical from "../../../components/navStatistical";
import { useFetchStatistics } from "../../../../../hook/useFetchStatistics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// ===== PLUGIN HIỂN THỊ TỔNG DOANH THU (Giữ nguyên cho Chart trên web) =====
// @param {Chart} chart - instance chart.js
// @param {object} args - đối số nội bộ của chart.js
// @param {object} pluginOptions - options, ở đây dùng pluginOptions.total để hiển thị tổng doanh thu
// @result  vẽ box "Tổng doanh thu" ở góc trên bên phải chart
const totalRevenuePlugin = {
  id: "totalRevenuePlugin",
  afterDraw(chart, args, pluginOptions) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    const { right, top } = chartArea;
    const total = pluginOptions?.total;
    if (total == null) return;

    const text = "Tổng doanh thu: " + total.toLocaleString("vi-VN") + " VNĐ";

    ctx.save();

    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = 16;

    const paddingX = 8;
    const paddingY = 4;
    const margin = 8;

    let boxX = right - (textWidth + paddingX * 2) - margin;
    let boxY = top - (textHeight + paddingY * 2) - margin;
    if (boxY < margin) boxY = margin;

    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.strokeStyle = "#CBB58A";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.rect(boxX, boxY, textWidth + paddingX * 2, textHeight + paddingY * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#111827";
    ctx.fillText(text, boxX + paddingX, boxY + (textHeight + paddingY * 2) / 2);

    ctx.restore();
  },
};

// =========================================================
//                  COMPONENT CHÍNH (Page)
// =========================================================

const Page = () => {
  const [mode, setMode] = useState("month"); // 'month' | 'year'
  const [view, setView] = useState("month"); // 'month' | 'year' | 'day'
  const [calendarMonth, setCalendarMonth] = useState(10); // 0-based
  const [calendarYear, setCalendarYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(null); // {day, month, year}
  const chartRef = useRef(null);
  const [chartImage, setChartImage] = useState(null); // State mới để lưu ảnh biểu đồ

  // Chuyển ArrayBuffer -> base64 cho jsPDF
  // @param buffer
  // @result  chuỗi base64 từ ArrayBuffer (dùng cho addFileToVFS của jsPDF)
const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary); // jsPDF sẽ dùng atob để decode ngược lại
};

// Load font Roboto từ /public/fonts/roboto/Roboto-Regular.ttf
// Đảm bảo file này tồn tại: public/fonts/roboto/Roboto-Regular.ttf
// @param pdf - instance jsPDF
  // @result  fetch font Roboto, chuyển sang base64, add vào VFS & addFont cho PDF
const loadRobotoFont = async (pdf) => {
  try {
    const res = await fetch("/fonts/static/Roboto-Regular.ttf");

    if (!res.ok) {
      console.error("Không load được font, status:", res.status);
      return;
    }

    const buffer = await res.arrayBuffer();
    const fontBase64 = arrayBufferToBase64(buffer);

    pdf.addFileToVFS("Roboto-Regular.ttf", fontBase64);
    pdf.addFont("Roboto-Regular.ttf", "RobotoVN", "normal");
  } catch (err) {
    console.error("Lỗi fetch font:", err);
  }
};

  // xác định mode cho API
  const apiMode =
    view === "year" ? "yearly" : view === "day" ? "daily" : "monthly";

  // build dateString cho API (theo format backend)
  const dateString =
    apiMode === "yearly"
      ? String(calendarYear) // "2025"
      : apiMode === "monthly"
      ? `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}` // "2025-11"
      : selectedDate
      ? `${selectedDate.year}-${String(selectedDate.month + 1).padStart(
          2,
          "0"
        )}-${String(selectedDate.day).padStart(2, "0")}` // "2025-11-26"
      : null;

  // gọi API
  const {
    data: apiRes,
    loading,
    error,
  } = useFetchStatistics(apiMode, dateString);
  const apiData = apiRes?.data || [];

  // xử lý đổi tháng
  //@param {number} offset - -1 lùi 1 tháng, 1 tiến 1 tháng
  //@result {void}
  const handleChangeMonth = (offset) => {
    setCalendarMonth((prevMonth) => {
      let newMonth = prevMonth + offset;
      let newYear = calendarYear;

      if (newMonth < 0) {
        newMonth = 11;
        newYear = calendarYear - 1;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear = calendarYear + 1;
      }

      setCalendarYear(newYear);
      return newMonth;
    });
  };

  //@param {"month"|"year"} newMode
  //@result {void}
  const handleChangeMode = (newMode) => {
    setMode(newMode);
    setView(newMode);
    if (newMode === "year") setSelectedDate(null);
  };

  //@param {number} day
  //@result {void}
  const handleSelectDay = (day) => {
    const date = { day, month: calendarMonth, year: calendarYear };
    setSelectedDate(date);
    setMode("month");
    setView("day");
  };

  // ====== BUILD CHART DATA TỪ API ======
  // ... (giữ nguyên logic dataYear, dataMonth, dataDay) ...

  // YEAR VIEW: từng tháng trong năm
  const labelsYear = [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ];

  const dataYearValues = useMemo(() => {
    const arr = Array(12).fill(0);
    apiData.forEach((item) => {
      if (item.month != null) {
        const idx = item.month - 1;
        if (idx >= 0 && idx < 12) {
          arr[idx] = item.totalAmount ?? 0;
        }
      }
    });
    return arr;
  }, [apiData]);

  const dataYear = {
    labels: labelsYear,
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: dataYearValues,
        backgroundColor: "#2F6FED",
        borderRadius: 4,
      },
    ],
  };

  // MONTH VIEW: từng ngày trong tháng
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const labelsMonth = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);

  const dataMonthValues = useMemo(() => {
    const arr = Array(daysInMonth).fill(0);
    apiData.forEach((item) => {
      if (item.day != null) {
        const idx = item.day - 1;
        if (idx >= 0 && idx < daysInMonth) {
          arr[idx] = item.totalAmount ?? 0;
        }
      }
    });
    return arr;
  }, [apiData, daysInMonth]);

  const dataMonth = {
    labels: labelsMonth,
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: dataMonthValues,
        backgroundColor: "#2F6FED",
        borderRadius: 2,
      },
    ],
  };

  // DAY VIEW: từng giờ trong ngày
  const labelsDay = Array.from({ length: 24 }, (_, i) => `${i}h`);

  const dataDay =
    selectedDate == null
      ? null
      : (() => {
          const arr = Array(24).fill(0);
          apiData.forEach((item) => {
            if (item.hour != null) {
              const idx = item.hour;
              if (idx >= 0 && idx < 24) {
                arr[idx] = item.totalAmount ?? 0;
              }
            }
          });
          return {
            labels: labelsDay,
            datasets: [
              {
                label: `Doanh thu ngày ${selectedDate.day}/${
                  selectedDate.month + 1
                } (VNĐ)`,
                data: arr,
                backgroundColor: "#2F6FED",
                borderRadius: 3,
              },
            ],
          };
        })();

  const chartData =
    view === "year"
      ? dataYear
      : view === "day" && dataDay
      ? dataDay
      : dataMonth;

  // tổng doanh thu
  const totalRevenue = useMemo(() => {
    if (!chartData || !chartData.datasets?.length) return 0;
    return chartData.datasets[0].data.reduce(
      (sum, v) => sum + (typeof v === "number" ? v : 0),
      0
    );
  }, [chartData]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text:
            view === "year"
              ? `Doanh thu năm ${calendarYear}`
              : view === "day" && selectedDate
              ? `Doanh thu ngày ${selectedDate.day}/${selectedDate.month + 1}/${
                  selectedDate.year
                }`
              : `Doanh thu tháng ${calendarMonth + 1} / ${calendarYear}`,
          font: { size: 20, weight: "bold" },
        },
        totalRevenuePlugin: {
          total: totalRevenue,
        },
      },
      scales: {
        x: {
          // bắt buộc vẽ đúng theo labels mảng chartData.labels
          type: "category",
          offset: true,
          ticks: {
            autoSkip: false, // 👈 KHÔNG được tự ẩn tick
            source: "labels", // 👈 dùng đúng danh sách labels
            maxRotation: 0,
            minRotation: 0,
            font: { size: 11 },
            callback(value, index) {
              // với category scale, value là index, ta lấy lại label để hiển thị
              // @ts-ignore
              const label = this.getLabelForValue(value);
              return label;
            },
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0,
            callback(value) {
              try {
                return value.toLocaleString("vi-VN") + " VNĐ";
              } catch {
                return value;
              }
            },
          },
        },
      },
    }),
    [view, selectedDate, calendarMonth, calendarYear, totalRevenue]
  );

  const getPDFTitle = () => {
    if (view === "year") {
      return `Báo Cáo Doanh Thu Năm ${calendarYear}`;
    }

    if (view === "month") {
      return `Báo Cáo Doanh Thu Tháng ${calendarMonth + 1} / ${calendarYear}`;
    }

    if (view === "day" && selectedDate) {
      const { day, month, year } = selectedDate;
      return `Báo Cáo Doanh Thu Ngày ${day}/${month + 1}/${year}`;
    }

    return "Báo Cáo Thống Kê Doanh Thu";
  };

  const getFileName = () => {
    // ... (giữ nguyên logic getFileName) ...
    if (view === "year") {
      return `thong-ke-doanh-thu-nam-${calendarYear}.pdf`;
    }

    if (view === "month") {
      return `thong-ke-doanh-thu-thang-${
        calendarMonth + 1
      }-${calendarYear}.pdf`;
    }

    if (view === "day" && selectedDate) {
      const { day, month, year } = selectedDate;
      return `thong-ke-doanh-thu-ngay-${day}-${month + 1}-${year}.pdf`;
    }

    return "thong-ke-doanh-thu.pdf";
  };

  // ====== CHUẨN BỊ DỮ LIỆU DẠNG BẢNG ======
  const tableData = useMemo(() => {
    // ... (giữ nguyên logic tableData) ...
    const headerMap = {
      yearly: "Thang",
      monthly: "Ngay",
      daily: "Gio",
    };

    // Cột đầu tiên tùy thuộc vào chế độ xem
    const headers = [headerMap[apiMode] || "Thời gian", "Doanh thu"];

    let rows = [];

    // Map apiData thành rows
    apiData.forEach((item) => {
      let timeLabel;
      if (apiMode === "yearly") {
        timeLabel = `Tháng ${item.month}`;
      } else if (apiMode === "monthly") {
        timeLabel = `Ngày ${item.day}`;
      } else if (apiMode === "daily") {
        timeLabel = `${item.hour}h`;
      } else {
        timeLabel = "N/A";
      }

      rows.push([
        timeLabel,
        (item.totalAmount ?? 0).toLocaleString("vi-VN") + " VNĐ",
      ]);
    });

    return { headers, rows };
  }, [apiData, apiMode]);

  // Xử lý việc chuyển biểu đồ sang ảnh để nhúng vào PDF
  // Dùng useEffect để tạo ảnh sau khi biểu đồ đã render
  useEffect(() => {
    const timer = setTimeout(() => {
      const chart = chartRef.current;
      if (chart && chart.canvas) {
        setChartImage(chart.canvas.toDataURL("image/png", 1.0));
      }
    }, 300); // chờ 300ms để chart render xong

    return () => clearTimeout(timer);
  }, [chartData]);



  const handleExportPDF = async  () => {
  // Đảm bảo biểu đồ đã render
  if (!chartRef.current) return;

  const pdf = new jsPDF("p", "mm", "a4"); // A4 dọc
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
// ===== NẠP FONT ROBOTO TIẾNG VIỆT =====
  await loadRobotoFont(pdf);

  // ===================== 1. TIÊU ĐỀ =====================
  const title = getPDFTitle();
  pdf.setFont("RobotoVN", "normal");
  pdf.setFontSize(18);
  pdf.text(title, pageWidth / 2, 15, { align: "center" });

  // ================= 2. TỔNG DOANH THU ==================
  pdf.setFont("RobotoVN", "normal");
  pdf.setFontSize(12);
  pdf.text(
    "Tổng doanh thu: " + totalRevenue.toLocaleString("vi-VN") + " VNĐ",
    15,
    25
  );

  // ================= 3. THÊM ẢNH CHART ==================
  try {
    // chartRef.current của react-chartjs-2 thường là instance Chart
    // nên canvas nằm trong chartRef.current.canvas
    const chartInstance = chartRef.current;
    const canvas = chartInstance.canvas || chartInstance; // fallback nếu ref trỏ thẳng canvas

    const imgData = canvas.toDataURL("image/png", 1.0);
    const chartWidth = pageWidth - 30; // chừa margin 15mm hai bên
    const chartHeight = (canvas.height / canvas.width) * chartWidth;

    let currentY = 30; // vị trí Y để vẽ chart
    pdf.addImage(imgData, "PNG", 15, currentY, chartWidth, chartHeight);
    currentY += chartHeight + 10; // cách chart 10mm

    // =========== 4. VẼ BẢNG CHI TIẾT CÓ KẺ Ô ============
    const startX = 15;            // lề trái
    const maxY = pageHeight - 20; // lề dưới
    const cellHeight = 8;

    const colCount = tableData.headers.length;
    const tableWidth = pageWidth - startX * 2;
    const colWidth = tableWidth / colCount;

    const drawHeader = () => {
      pdf.setFont("RobotoVN", "normal");
      pdf.setFontSize(11);

      tableData.headers.forEach(function (header, colIndex) {
        const x = startX + colIndex * colWidth;
        pdf.rect(x, currentY, colWidth, cellHeight);        // viền ô header
        pdf.text(String(header), x + 2, currentY + 5);      // text lệch 2mm
      });

      currentY += cellHeight;
      pdf.setFont("RobotoVN", "normal");
      pdf.setFontSize(10);
    };

    const drawRow = (row) => {
      row.forEach(function (cell, colIndex) {
        const x = startX + colIndex * colWidth;
        pdf.rect(x, currentY, colWidth, cellHeight);        // viền ô
        pdf.text(String(cell), x + 2, currentY + 5);        // text lệch 2mm
      });
      currentY += cellHeight;
    };

    // Nếu ngay sau chart đã gần chạm đáy trang → sang trang mới
    if (currentY + cellHeight > maxY) {
      pdf.addPage();
      currentY = 20;
    }

    // Header bảng lần đầu
    drawHeader();

    // Các dòng dữ liệu, tự động sang trang nếu đầy
    tableData.rows.forEach(function (row) {
      if (currentY + cellHeight > maxY) {
        pdf.addPage();
        currentY = 20;
        drawHeader(); // vẽ lại header ở trang mới
      }
      drawRow(row);
    });

    // ================== 5. LƯU FILE =====================
    pdf.save(getFileName());
  } catch (err) {
    console.error("Lỗi tạo PDF:", err);
  }
};



  return (
    <div className="w-full h-full bg-white rounded-[10px] p-6 flex flex-row gap-6">
      <div className="w-full h-[90%] flex flex-col gap-4">
        <NavStatistical
          mode={mode}
          onChangeMode={handleChangeMode}
          selectedDate={selectedDate}
          onSelectDay={handleSelectDay}
          calendarMonth={calendarMonth}
          calendarYear={calendarYear}
          onChangeMonth={handleChangeMonth}
        />

        <div className="mt-4 w-full h-full border-[3px] border-[#CBB58A] rounded-[15px] px-6 py-4 overflow-hidden">
          {error && (
            <div className="text-red-500 text-sm mb-2">
              Lỗi tải dữ liệu doanh thu.
            </div>
          )}
          {loading && (
            <div className="text-gray-500 text-sm mb-2">
              Đang tải dữ liệu...
            </div>
          )}
          {/* chart start here */}
          <Bar
            data={chartData}
            options={options}
            plugins={[totalRevenuePlugin]}
            ref={chartRef}
          />
          {/* chart end here */}
        </div>
      </div>
      <div>
        <button
          onClick={handleExportPDF}
          disabled={!chartImage}
          className={`px-4 py-2 rounded-lg mt-3 shadow ${
            chartImage
              ? "bg-[#e74c3c] text-white hover:bg-[#c0392b]"
              : "bg-gray-400 text-white"
          }`}
        >
          Xuất PDF
        </button>
      </div>
    </div>
  );
};

export default Page;
