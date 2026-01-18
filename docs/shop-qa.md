# Shop QA Checklist

## Seed data
- Sign in as admin.
- Open `/vi/CuaHangPhuKien/admin` and click "Seed dữ liệu mẫu".
- Confirm products and categories render on `/vi/CuaHangPhuKien`.

## Storefront flow
- Open `/vi/CuaHangPhuKien`, filter categories, confirm listing updates.
- Open a product detail page, check metadata and JSON-LD in HTML.
- Add product to cart, verify cart totals update.

## Checkout flow
- Ensure cart contains items.
- Navigate to `/vi/CuaHangPhuKien/checkout`.
- Submit shipping info and payment method.
- Confirm order detail page renders and cart is cleared.

## Account flow
- Open `/vi/CuaHangPhuKien/account`.
- Confirm order list shows the new order.
- Open order detail page and verify timeline.

## Admin flow
- In `/vi/CuaHangPhuKien/admin`, create a category and product.
- Update order status to `processing` and verify badge changes.
