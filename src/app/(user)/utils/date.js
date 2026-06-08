export const parseBirthday = (s) => {
  const t = String(s || "").trim();
  if (!t) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    const d = new Date(t);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const m = t.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) {
    const dd = Number(m[1]);
    const mm = Number(m[2]) - 1;
    const yy = Number(m[3]);
    const d = new Date(yy, mm, dd);
    if (d.getFullYear() === yy && d.getMonth() === mm && d.getDate() === dd) return d;
  }
  const d2 = new Date(t);
  return Number.isNaN(d2.getTime()) ? null : d2;
};

export const calcAge = (date) => {
  if (!date) return 0;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
  return age;
};

// Process raw birthday input into masked dd/mm/yyyy and basic validation
export const processBirthdayInput = (raw) => {
  const src = String(raw || "");
  const digits = src.replace(/\D+/g, "").slice(0, 8);

  // Nếu trống hoàn toàn
  if (!digits) return { value: "", error: undefined };

  let dd = digits.slice(0, 2);
  let mm = digits.slice(2, 4);
  let yy = digits.slice(4, 8);

  // ❌ Đừng auto pad khi người dùng mới gõ 1 số
  // ✅ Chỉ format khi họ gõ 2 chữ số trở lên
  if (digits.length < 2) {
    return { value: digits, error: undefined };
  }

  // Xây dựng format dd/mm/yyyy
  let out = dd;
  if (digits.length > 2) out += "/" + mm;
  if (digits.length > 4) out += "/" + yy;

  // ✅ Kiểm tra hợp lệ (khi có đủ phần)
  let err = "";
  const toNum = (s) => (s ? Number(s) : NaN);
  const dNum = toNum(dd);
  const mNum = toNum(mm);
  const yNum = toNum(yy);
  const currentYear = new Date().getFullYear();

  if (dd && (dNum < 1 || dNum > 31)) err = "Ngày không hợp lệ (dd/mm/yyyy)";
  if (!err && mm && (mNum < 1 || mNum > 12)) err = "Tháng không hợp lệ (dd/mm/yyyy)";
  if (!err && yy && (yNum < 1900 || yNum > currentYear)) err = "Năm không hợp lệ (dd/mm/yyyy)";
  if (!err && dd && mm && yy) {
    const d = new Date(yNum, mNum - 1, dNum);
    if (d.getFullYear() !== yNum || d.getMonth() + 1 !== mNum || d.getDate() !== dNum)
      err = "Ngày không hợp lệ (dd/mm/yyyy)";
  }

  return { value: out, error: err || undefined };
};
