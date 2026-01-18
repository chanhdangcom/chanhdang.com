import type {
  CartItem,
  Category,
  Coupon,
  Order,
  Product,
} from "./types";

const MAX_NAME_LENGTH = 120;
const MAX_DESC_LENGTH = 5000;

export function validateProductInput(payload: Partial<Product>) {
  const errors: string[] = [];
  if (!payload.name || payload.name.trim().length < 2) {
    errors.push("Tên sản phẩm không hợp lệ.");
  }
  if (payload.name && payload.name.length > MAX_NAME_LENGTH) {
    errors.push("Tên sản phẩm quá dài.");
  }
  if (!payload.slug || payload.slug.trim().length < 2) {
    errors.push("Slug sản phẩm không hợp lệ.");
  }
  if (!payload.description || payload.description.trim().length < 10) {
    errors.push("Mô tả sản phẩm quá ngắn.");
  }
  if (payload.description && payload.description.length > MAX_DESC_LENGTH) {
    errors.push("Mô tả sản phẩm quá dài.");
  }
  if (typeof payload.price !== "number" || payload.price < 0) {
    errors.push("Giá sản phẩm không hợp lệ.");
  }
  if (payload.salePrice !== undefined && payload.salePrice < 0) {
    errors.push("Giá khuyến mãi không hợp lệ.");
  }
  if (!Array.isArray(payload.images) || payload.images.length === 0) {
    errors.push("Cần ít nhất 1 hình ảnh.");
  }
  if (payload.stock !== undefined && payload.stock < 0) {
    errors.push("Tồn kho không hợp lệ.");
  }
  return { valid: errors.length === 0, errors };
}

export function validateCategoryInput(payload: Partial<Category>) {
  const errors: string[] = [];
  if (!payload.name || payload.name.trim().length < 2) {
    errors.push("Tên danh mục không hợp lệ.");
  }
  if (!payload.slug || payload.slug.trim().length < 2) {
    errors.push("Slug danh mục không hợp lệ.");
  }
  return { valid: errors.length === 0, errors };
}

export function validateCartItemInput(payload: Partial<CartItem>) {
  const errors: string[] = [];
  if (!payload.productId) {
    errors.push("Thiếu productId.");
  }
  if (typeof payload.quantity !== "number" || payload.quantity <= 0) {
    errors.push("Số lượng không hợp lệ.");
  }
  if (typeof payload.price !== "number" || payload.price < 0) {
    errors.push("Giá sản phẩm không hợp lệ.");
  }
  return { valid: errors.length === 0, errors };
}

export function validateOrderInput(payload: Partial<Order>) {
  const errors: string[] = [];
  if (!payload.items || payload.items.length === 0) {
    errors.push("Đơn hàng cần ít nhất 1 sản phẩm.");
  }
  if (!payload.shippingAddress) {
    errors.push("Thiếu địa chỉ giao hàng.");
  }
  if (!payload.paymentMethod) {
    errors.push("Thiếu phương thức thanh toán.");
  }
  if (typeof payload.total !== "number" || payload.total < 0) {
    errors.push("Tổng tiền không hợp lệ.");
  }
  return { valid: errors.length === 0, errors };
}

export function validateCouponInput(payload: Partial<Coupon>) {
  const errors: string[] = [];
  if (!payload.code || payload.code.trim().length < 3) {
    errors.push("Mã giảm giá không hợp lệ.");
  }
  if (!payload.type || (payload.type !== "percent" && payload.type !== "fixed")) {
    errors.push("Loại mã giảm giá không hợp lệ.");
  }
  if (typeof payload.value !== "number" || payload.value <= 0) {
    errors.push("Giá trị mã giảm giá không hợp lệ.");
  }
  return { valid: errors.length === 0, errors };
}
