export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currentPrice: number | null;
  stock: number;
  totalSold: number;
  categoryId: string;
  subcategoryId: string | null;
  brandId: string | null;
  category: string;
  subcategory: string | undefined;
  brand: string | undefined;
  rating: number;
  reviewCount: number;
  images: string[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  dealId: string | null;
  discountPercent: number | null;
  dealEndsAt: string | null;
  dealQuantity: number | null;
  dealSoldCount: number | null;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isFeatured: boolean;
  variants: ProductVariant[];
  reviews: Review[];
}

export interface ProductVariant {
  id: string;
  name: string;
  productId: string;
  price: number;
  stock: number;
  sku: string;
  attributes: Record<string, string>;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId: string | null;
  title: string | null;
  comment: string | null;
  rating: number;
  helpful: number;
  verified: boolean;
  createdAt: string;
}

export interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination?: Pagination;
}

export type SortBy = "price" | "popularity" | "rating" | "newest";
export type SortOptions = "asc" | "desc";

export interface ProductsFilter {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: "true" | "false";
  sortBy?: SortBy;
  sortOrder?: SortOptions;
  page?: number;
  limit?: number;
}
