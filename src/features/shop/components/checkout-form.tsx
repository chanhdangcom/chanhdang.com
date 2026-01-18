import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PaymentMethod, ShippingAddress } from "../types";

type CheckoutFormProps = {
  onSubmit: (payload: { shippingAddress: ShippingAddress; paymentMethod: PaymentMethod }) => void;
  isSubmitting?: boolean;
};

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Vietnam",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  return (
    <form
      className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ shippingAddress: address, paymentMethod });
      }}
    >
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Thông tin giao hàng</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Họ và tên"
          value={address.fullName}
          onChange={(event) => setAddress({ ...address, fullName: event.target.value })}
          required
        />
        <Input
          placeholder="Số điện thoại"
          value={address.phone}
          onChange={(event) => setAddress({ ...address, phone: event.target.value })}
          required
        />
      </div>
      <Input
        placeholder="Địa chỉ"
        value={address.addressLine1}
        onChange={(event) => setAddress({ ...address, addressLine1: event.target.value })}
        required
      />
      <Input
        placeholder="Địa chỉ bổ sung"
        value={address.addressLine2}
        onChange={(event) => setAddress({ ...address, addressLine2: event.target.value })}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Thành phố"
          value={address.city}
          onChange={(event) => setAddress({ ...address, city: event.target.value })}
          required
        />
        <Input
          placeholder="Tỉnh/Thành"
          value={address.state}
          onChange={(event) => setAddress({ ...address, state: event.target.value })}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          placeholder="Mã bưu chính"
          value={address.postalCode}
          onChange={(event) => setAddress({ ...address, postalCode: event.target.value })}
        />
        <Input
          placeholder="Quốc gia"
          value={address.country}
          onChange={(event) => setAddress({ ...address, country: event.target.value })}
        />
      </div>
      <Input
        placeholder="Ghi chú giao hàng"
        value={address.note}
        onChange={(event) => setAddress({ ...address, note: event.target.value })}
      />

      <div className="space-y-2">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Phương thức thanh toán
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { id: "cod", label: "Thanh toán khi nhận hàng" },
            { id: "bank_transfer", label: "Chuyển khoản ngân hàng" },
            { id: "card", label: "Thẻ quốc tế" },
          ].map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id as PaymentMethod)}
              className={`rounded-xl border px-4 py-3 text-sm transition ${
                paymentMethod === method.id
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
      </Button>
    </form>
  );
}
