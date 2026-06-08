
export const toIntegerVND = (input) => {
  if (typeof input === "number" && Number.isFinite(input)) {
    return Math.round(input);
  }
  let string = String(input ?? "").trim();
  if (!string) return 0;
  if (/\.00$/.test(string)) string = string.slice(0, -3);
  string = string.replace(/\./g, "");
  if (!string) return 0;
  const number = Number(string);
  return Number.isFinite(number) ? number : 0;
};

