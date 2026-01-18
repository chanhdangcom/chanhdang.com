export type ShopImage = {
  url: string;
  alt?: string;
};

export type ProductVariant = {
  name: string;
  options: string[];
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  images: ShopImage[];
  categoryId?: string;
  categorySlug?: string;
  tags?: string[];
  variants?: ProductVariant[];
  specs?: ProductSpec[];
  stock: number;
  ratingAvg?: number;
  reviewCount?: number;
  isActive?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type Category = {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  image?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type CartItem = {
  productId: string;
  productName?: string;
  productSlug?: string;
  image?: string;
  price: number;
  quantity: number;
  variant?: string;
};

export type Cart = {
  _id?: string;
  id?: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  total: number;
  updatedAt?: Date | string;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type ShippingAddress = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  note?: string;
};

export type PaymentMethod = "cod" | "bank_transfer" | "card";

export type Order = {
  _id?: string;
  id?: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount?: number;
  shippingFee?: number;
  total: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  timeline?: Array<{
    status: OrderStatus;
    at: Date | string;
    note?: string;
  }>;
};

export type Coupon = {
  _id?: string;
  id?: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSubtotal?: number;
  maxDiscount?: number;
  active: boolean;
  expiresAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type Review = {
  _id?: string;
  id?: string;
  productId: string;
  userId: string;
  rating: number;
  content: string;
  createdAt?: Date | string;
};
