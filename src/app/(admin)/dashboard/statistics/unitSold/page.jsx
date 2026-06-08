"use client";

import jsPDF from "jspdf"; // Import jsPDF

import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Đã xóa tất cả các import từ @react-pdf/renderer

import NavStatistical from "../../../components/navStatistical";
import { useFetchUnitSold } from "../../../../../hook/useFetchUnitSold";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Đã xóa Font.register và PDF_STYLES

// Đã xóa StatisticalPDF component

const Page = () => {
  const [mode, setMode] = useState("month"); // UI: 'month' | 'year'
  const [view, setView] = useState("month"); // 'month' | 'year' | 'day'

  const [calendarMonth, setCalendarMonth] = useState(10); // 0-based: 10 = November
  const [calendarYear, setCalendarYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState(null); // {year, month, day}

  const [legendOpen, setLegendOpen] = useState(false);
  const chartRef = useRef(null);
  const [chartReady, setChartReady] = useState(false);
  // Đã loại bỏ chartImage state, sẽ lấy dữ liệu ảnh trực tiếp khi xuất PDF

  // Chuyển ArrayBuffer -> base64 cho jsPDF
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

  // ====== ĐỔI THÁNG ======
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

  // ====== ĐỔI MODE (Theo tháng / Theo năm) ======
  const handleChangeMode = (newMode) => {
    // newMode: 'month' | 'year' (từ NavStatistical)
    setMode(newMode);
    setView(newMode);
    if (newMode === "year") {
      setSelectedDate(null);
    }
  };

  // ====== CHỌN NGÀY TRÊN LỊCH ======
  const handleSelectDay = (day) => {
    const date = {
      year: calendarYear,
      month: calendarMonth,
      day,
    };
    setSelectedDate(date);
    setMode("month");
    setView("day");
  };

  // ====== MAP UI -> apiMode & dateString ======
  // apiMode: 'daily' | 'monthly' | 'yearly' (backend yêu cầu)
  let apiMode = "monthly";
  let dateString = `${calendarYear}-${String(calendarMonth + 1).padStart(
    2,
    "0"
  )}`;

  if (view === "year") {
    apiMode = "yearly";
    dateString = String(calendarYear); // "2025"
  } else if (view === "day" && selectedDate) {
    apiMode = "daily";
    dateString = `${selectedDate.year}-${String(
      selectedDate.month + 1
    ).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`; // "2025-11-27"
  }

  // ====== GỌI API THỰC ======
  const { data: unitSoldData, loading } = useFetchUnitSold(apiMode, dateString);

  // unitSoldData: [
  //   { year, month, day, hour?, productId, productName, quantity }
  // ]

  // ====== CHUYỂN DỮ LIỆU API -> CHARTJS ======
  const { labels, datasets } = useMemo(() => {
    if (!unitSoldData || unitSoldData.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labelSet = new Set();
    const productMap = {}; // productName -> { label -> quantity }

    unitSoldData.forEach((item) => {
      let label;
      if (apiMode === "yearly") {
        label = String(item.month); // month 1-based trên response
      } else if (apiMode === "monthly") {
        label = String(item.day); // "1", "2", ...
      } else {
        // daily
        label = String(item.hour);
      }

      labelSet.add(label);

      const key = item.productName || item.productId;
      if (!productMap[key]) {
        productMap[key] = {};
      }
      productMap[key][label] = (productMap[key][label] || 0) + item.quantity;
    });

    // sort label theo số
    const sortedLabels = Array.from(labelSet)
      .sort((a, b) => {
        const na = parseInt(a);
        const nb = parseInt(b);
        return na - nb;
      })
      .map((label) => {
        if (apiMode === "yearly") return `T${label}`;
        if (apiMode === "monthly") return label;
        return `${label}h`;
      });

    const colors = ["#2F6FED", "#F59E0B", "#10B981", "#EF4444", "#6366F1"];

    const datasets = Object.entries(productMap).map(
      ([productName, dataByLabel], idx) => ({
        label: `${productName}`,
        data: Array.from(labelSet)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((lb) => dataByLabel[lb] || 0),
        borderColor: colors[idx % colors.length],
        tension: 0.3,
        fill: false,
      })
    );

    return { labels: sortedLabels, datasets };
  }, [unitSoldData, apiMode]);

  const chartData = { labels, datasets };

  // ====== TỔNG SỐ LƯỢNG ĐÃ BÁN ======
  const totalOrders = useMemo(() => {
    return datasets.reduce(
      (sum, ds) =>
        sum + ds.data.reduce((s, v) => s + (typeof v === "number" ? v : 0), 0),
      0
    );
  }, [datasets]);

  // ====== PLUGIN HIỂN THỊ TỔNG TRÊN GÓC PHẢI ======
  const totalAmountPlugin = {
    id: "totalAmountPlugin",
    afterDraw(chart, args, pluginOptions) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      const { left, top } = chartArea; // 👉 dùng left thay vì right
      const total = pluginOptions?.total;
      if (total == null) return;

      const text = `Tổng đã bán: ${total.toLocaleString("vi-VN")} sp`;

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

      // 👉 vẽ box ở góc trên bên trái của chart
      let boxX = left + margin;
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
      ctx.fillText(
        text,
        boxX + paddingX,
        boxY + (textHeight + paddingY * 2) / 2
      );

      ctx.restore();
    },
  };

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
              ? `Số lượng sản phẩm bán theo tháng năm ${calendarYear}`
              : view === "day" && selectedDate
              ? `Số lượng sản phẩm bán theo giờ ngày ${selectedDate.day}/${
                  selectedDate.month + 1
                }/${selectedDate.year}`
              : `Số lượng sản phẩm bán theo ngày tháng ${
                  calendarMonth + 1
                } / ${calendarYear}`,
          font: { size: 20, weight: "bold" },
        },
        totalAmountPlugin: {
          total: totalOrders,
        },
        tooltip: {
          // nền tooltip, tiêu đề… tùy bạn
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",

          callbacks: {
            // 👇 Đổi màu chữ body theo màu dataset tương ứng
            labelTextColor(context) {
              // borderColor hoặc backgroundColor tùy line/border bạn dùng
              return (
                context.dataset.borderColor ||
                context.dataset.backgroundColor ||
                "#ffffff"
              );
            },

            // Nếu muốn chỉnh lại nội dung text luôn
            label(context) {
              const label = context.dataset.label || "";
              const value = context.formattedValue || context.raw;
              return `${label}: ${value}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback(value) {
              return `${value} sp`;
            },
          },
        },
      },
    }),
    [view, selectedDate, calendarMonth, calendarYear, totalOrders]
  );

  const getFileName = () => {
    if (view === "year") return `thong-ke-so-luong-ban-nam-${calendarYear}.pdf`;
    if (view === "month")
      return `thong-ke-so-luong-ban-thang-${
        calendarMonth + 1
      }-${calendarYear}.pdf`;
    if (view === "day" && selectedDate)
      return `thong-ke-so-luong-ban-ngay-${selectedDate.day}-${
        selectedDate.month + 1
      }-${selectedDate.year}.pdf`;
    return "thong-ke-so-luong-ban.pdf";
  };

  const getPDFTitle = () => {
    if (view === "year") return `Báo Cáo Số Lượng Bán Năm ${calendarYear}`;
    if (view === "month")
      return `Báo Cáo Số Lượng Bán Tháng ${calendarMonth + 1}/${calendarYear}`;
    if (view === "day" && selectedDate)
      return `Báo Cáo Số Lượng Bán Ngày ${selectedDate.day}/${
        selectedDate.month + 1
      }/${selectedDate.year}`;
    return "Báo Cáo Thống Kê Số Lượng Bán";
  };

  // BUILD TABLE DATA
  const tableData = useMemo(() => {
    const headers = [
      apiMode === "yearly" ? "Tháng" : apiMode === "monthly" ? "Ngày" : "Giờ",
      "Số Lượng bán",
    ];
    const rows = [];
    // Cần sử dụng unitSoldData (dữ liệu thô) để xây dựng bảng chi tiết
    unitSoldData?.forEach((item) => {
      let label =
        apiMode === "yearly"
          ? `Tháng ${item.month}`
          : apiMode === "monthly"
          ? `Ngày ${item.day}`
          : `${item.hour}h`;
      // Giả sử muốn hiển thị chi tiết từng sản phẩm
      rows.push([
        label,
        `${item.productName || item.productId}: ${item.quantity.toLocaleString(
          "vi-VN"
        )} sp`,
      ]);
    });

    // Nếu muốn gộp tổng số lượng bán theo thời gian, cần xử lý lại logic tableData
    const aggregatedData = {};
    unitSoldData?.forEach((item) => {
      let label =
        apiMode === "yearly"
          ? `Tháng ${item.month}`
          : apiMode === "monthly"
          ? `Ngày ${item.day}`
          : `${item.hour}h`;
      aggregatedData[label] = (aggregatedData[label] || 0) + item.quantity;
    });

    const finalRows = Object.entries(aggregatedData).map(
      ([label, quantity]) => [label, `${quantity.toLocaleString("vi-VN")} sp`]
    );

    return { headers, rows: finalRows };
  }, [unitSoldData, apiMode]);

  // Đã loại bỏ useEffect tạo ảnh

  const handleExportPDF = async () => {
    const chart = chartRef.current;
    if (!chart) return;

    const canvas = chart.canvas || chart;
    const imgData = canvas.toDataURL("image/png", 1.0);

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // 👉 NẠP FONT ROBOTO TIẾNG VIỆT
    await loadRobotoFont(pdf);

    // ============= 1. TIÊU ĐỀ =============
    const title = getPDFTitle();
    pdf.setFont("RobotoVN", "normal");
    pdf.setFontSize(18);
    pdf.text(title, pageWidth / 2, 15, { align: "center" });

    // ============= 2. ẢNH CHART ============
    const chartWidth = pageWidth - 30;
    const chartHeight = (canvas.height / canvas.width) * chartWidth;

    let currentY = 25;
    pdf.addImage(imgData, "PNG", 15, currentY, chartWidth, chartHeight);
    currentY += chartHeight + 8;

    // ============= 3. TỔNG ĐÃ BÁN =========
    pdf.setFont("RobotoVN", "normal");
    pdf.setFontSize(12);
    pdf.text(
      "Tổng đã bán: " + totalOrders.toLocaleString("vi-VN") + " sp",
      15,
      currentY
    );

    // ============= 4. CHÚ THÍCH (LEGEND) ============
    const legendMarginTop = 8;
    const boxSize = 5;
    const legendLineHeight = 7;
    let legendY = currentY + legendMarginTop;

    pdf.setFont("RobotoVN", "normal");
    pdf.setFontSize(11);
    pdf.text("Chú thích sản phẩm:", 15, legendY);
    legendY += legendLineHeight;

    datasets.forEach((ds) => {
      if (legendY > pageHeight - 20) {
        pdf.addPage();
        legendY = 20;
        pdf.setFont("RobotoVN", "normal");
        pdf.setFontSize(11);
        pdf.text("Chú thích sản phẩm:", 15, legendY);
        legendY += legendLineHeight;
      }

      pdf.setFillColor(ds.borderColor || "#000000");
      pdf.rect(15, legendY - boxSize * 0.7, boxSize, boxSize, "F");

      pdf.setFont("RobotoVN", "normal");
      pdf.setFontSize(10);
      pdf.text(ds.label, 15 + boxSize + 3, legendY);
      legendY += legendLineHeight;
    });

    // ============= 5. BẢNG CÓ KẺ Ô ============
    currentY = legendY + 10;

    const startX = 15;
    const maxY = pageHeight - 20;
    const cellHeight = 7;

    const colCount = tableData.headers.length;
    const tableWidth = pageWidth - startX * 2;
    const colWidth = tableWidth / colCount;

    const drawHeader = () => {
      pdf.setFont("RobotoVN", "normal");
      pdf.setFontSize(11);

      tableData.headers.forEach((header, colIndex) => {
        const x = startX + colIndex * colWidth;
        pdf.rect(x, currentY, colWidth, cellHeight);
        pdf.text(String(header), x + 2, currentY + 4.5);
      });

      currentY += cellHeight;
      pdf.setFont("RobotoVN", "normal");
      pdf.setFontSize(10);
    };

    const drawRow = (row) => {
      row.forEach((cell, colIndex) => {
        const x = startX + colIndex * colWidth;
        pdf.rect(x, currentY, colWidth, cellHeight);
        pdf.text(String(cell), x + 2, currentY + 4.5);
      });
      currentY += cellHeight;
    };

    if (currentY + cellHeight > maxY) {
      pdf.addPage();
      currentY = 20;
    }

    drawHeader();

    tableData.rows.forEach((row) => {
      if (currentY + cellHeight > maxY) {
        pdf.addPage();
        currentY = 20;
        drawHeader();
      }
      drawRow(row);
    });

    // ============= 6. LƯU FILE ============
    pdf.save(getFileName());
  };

  useEffect(() => {
    // chartRef.current là đối tượng Chart.js, không phải Line component
    if (chartRef.current && !chartReady) {
      // Đặt timeout 100ms để đảm bảo canvas đã vẽ xong hoàn toàn
      // trước khi cho phép xuất PDF.
      const timer = setTimeout(() => {
        setChartReady(true);
        console.log("Chart is ready for PDF export.");
      }, 100);

      return () => clearTimeout(timer); // Cleanup
    }
    // Nếu dữ liệu tải lại (loading, data thay đổi) thì reset
    if (loading || !unitSoldData || unitSoldData.length === 0) {
      if (chartReady) setChartReady(false);
    }
  }, [chartRef.current, chartReady, loading, unitSoldData]);

  // Biến kiểm tra xem chart đã render chưa để kích hoạt nút
  const isChartRendered = chartReady;

  return (
    <div className="w-full h-full bg-white rounded-[10px] p-6 flex flex-row gap-6 overflow-auto">
      <div className="w-full h-[75%] flex flex-col gap-4">
        <NavStatistical
          mode={mode}
          onChangeMode={handleChangeMode}
          selectedDate={selectedDate}
          onSelectDay={handleSelectDay}
          calendarMonth={calendarMonth}
          calendarYear={calendarYear}
          onChangeMonth={handleChangeMonth}
        />

        <div className="mt-4 w-full h-full border-[3px] border-[#CBB58A] rounded-[15px] px-6 py-4 relative">
          {/* Nút mở legend */}
          <button
            onClick={() => setLegendOpen((prev) => !prev)}
            className="absolute top-3 right-4 z-20 text-xs px-3 py-1 rounded-full border border-[#CBB58A] bg-white shadow-sm hover:bg-[#f8f3e7] transition"
          >
            {legendOpen ? "Ẩn chú thích" : "Hiện chú thích"}
          </button>

          {/* Popup legend */}
          {legendOpen && (
            <div className="absolute top-10 right-4 z-0 bg-white border border-gray-300 rounded-md shadow-lg p-3 max-w-xs max-h-64 overflow-auto text-xs">
              <div className="font-semibold mb-2">Chú Thích SP</div>
              {datasets.map((ds, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: ds.borderColor }}
                  />
                  <span>{ds.label}</span>
                </div>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-sm text-gray-500 mt-8">
              Đang tải dữ liệu...
            </div>
          ) : (
            <>
              {/* chart start here */}
              <Line
                data={chartData}
                options={options}
                plugins={[totalAmountPlugin]}
                ref={chartRef}
              />
              {/* chart end here */}
            </>
          )}
        </div>
      </div>
      <div>
        <button
          onClick={handleExportPDF}
          disabled={!isChartRendered}
          className={`px-4 py-2 rounded-lg mt-3 shadow ${
            isChartRendered
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
