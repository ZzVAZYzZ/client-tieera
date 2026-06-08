"use client";
import React from "react";
import { toIntegerVND } from "../utils/price";
import InsideCart from "../../../assets/icons/inside_cart";
import TrashIcon from "../../../assets/icons/trash_icon";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";


const fmt = (v) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(v);

const loadCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("cart_items");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem("cart_items", JSON.stringify(items));
  } catch {}
};

export default function Page() {
  const [items, setItems] = React.useState([]);
  const router = useRouter();
  const {user} = useSelector((state) => state.user);


  React.useEffect(()=>{
    console.log(user);
  },[])

  React.useEffect(() => {
    setItems(loadCart());
  }, []);

  const setAndSave = (updater) => {
    setItems((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveCart(next);
      return next;
    });
  };

  const toggleAll = (checked) => {
    setAndSave(items.map((it) => ({ ...it, selected: !!checked })));
  };

  const toggleOne = (id, checked) => {
    setAndSave(
      items.map((it) =>
        String(it.product_id) === String(id)
          ? { ...it, selected: !!checked }
          : it
      )
    );
  };

  const removeOne = (id) => {
    setAndSave(items.filter((it) => String(it.product_id) !== String(id)));
  };

  const clearAll = () => setAndSave([]);

  const changeQty = (id, delta) => {
    setAndSave(
      items.map((it) => {
        if (String(it.product_id) !== String(id)) return it;
        const next = Math.max(1, (Number(it.quantity) || 1) + delta);
        return { ...it, quantity: next };
      })
    );
  };

  const priceParts = (it) => {
    const price = toIntegerVND(it.price);
    const discount = toIntegerVND(it.discount_price);
    const has = discount > 0 && discount < price;
    const final = has ? Math.max(price - discount, 0) : price;
    return { price, discount: has ? discount : 0, final };
  };

  const selectedItems = items.filter((it) => it.selected);
  const subtotal = selectedItems.reduce(
    (sum, it) => sum + priceParts(it).price * (Number(it.quantity) || 1),
    0
  );
  const discountTotal = selectedItems.reduce(
    (sum, it) => sum + priceParts(it).discount * (Number(it.quantity) || 1),
    0
  );
  const total = Math.max(subtotal - discountTotal, 0);
  React.useEffect(() => {
  try {
    localStorage.setItem("cart_total", JSON.stringify(total));
  } catch (e) {
    console.error("Không thể lưu tổng tiền:", e);
  }
}, [total]);

  const allChecked = items.length > 0 && items.every((it) => it.selected);

  const navigateToOrderInfoPage = () => {
    if(user!=null) {
      router.push("/orderinfo")
    }else{
      alert("Bạn cần đăng nhập để đặt hàng!")
    };
  }

  if (items.length === 0) {
    return (
      <div className="w-full flex justify-center bg-[#ECECEC]">
        <div className="w-[90%] max-w-[1100px] mt-[60px] mb-12">
          <div className="bg-white rounded-xl border p-10 flex items-center justify-center ">
            <div className="text-center">
              <InsideCart />
              <div className="text-lg">Giỏ hàng hiện đang trống</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center mt-6 mb-12">
      <div className="w-[90%] max-w-[1200px]">
        <div className="w-full bg-white rounded-xl border p-6 flex flex-col">
          <div className="text-center text-2xl font-semibold mb-6">
            Giỏ hàng
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => toggleAll(e.target.checked)}
              />
              Tất cả sản phẩm
            </label>
            <button className="text-sm text-red-500" onClick={clearAll}>
              Xóa tất cả
            </button>
          </div>

          <div className=" bg-white rounded-lg">
            {items.map((it) => {
              const { price, final } = priceParts(it);
              return (
                <div
                  key={it.product_id}
                  className="p-4 flex items-center gap-4"
                >
                  <input
                    type="checkbox"
                    checked={!!it.selected}
                    onChange={(e) => toggleOne(it.product_id, e.target.checked)}
                  />
                  {it.image_url ? (
                    <img
                      src={it.image_url}
                      alt={it.name}
                      className="w-[64px] h-[64px] object-cover rounded"
                    />
                  ) : (
                    <div className="w-[64px] h-[64px] bg-gray-200 rounded" />
                  )}
                  <div className="flex-1">
                    <div className="text-[16px]">{it.name}</div>
                    <div className="mt-2 inline-flex items-center border rounded bg-[#F4F4F4]">
                      <button
                        className="px-3 py-1 cursor-pointer"
                        onClick={() => changeQty(it.product_id, -1)}
                      >
                        -
                      </button>
                      <div className="px-4 py-1 border-l border-r select-none">
                        {Number(it.quantity) || 1}
                      </div>
                      <button
                        className="px-3 py-1 cursor-pointer"
                        onClick={() => changeQty(it.product_id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="mt-2 text-[#3A3A3A] font-semibold">
                      {fmt(final)} đ
                    </div>
                  </div>
                  <button
                    className=" cursor-pointer hover:text-red-500"
                    title="Xóa"
                    onClick={() => removeOne(it.product_id)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="w-full mt-6">
            <div className="flex flex-col items-center">
              <div className="w-[90%] text-[16px] text-[#3A3A3A] space-y-2">
                <div className="flex justify-between">
                  <p>Tạm tính</p>
                  <p>{fmt(subtotal)} đ</p>
                </div>
                <div className="flex justify-between">
                  <p>Giảm giá</p>
                  <p>{fmt(discountTotal)} đ</p>
                </div>
                <div className="flex justify-between font-semibold text-[18px] mt-3">
                  <p>Tổng tiền</p>
                  <p>{fmt(total)} đ</p>
                </div>
              </div>
              
              <button onClick={navigateToOrderInfoPage} className="mt-6 w-[90%] h-[44px] rounded-full bg-[#9B8D6F] text-white font-medium cursor-pointer hover:opacity-90 transition">
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
