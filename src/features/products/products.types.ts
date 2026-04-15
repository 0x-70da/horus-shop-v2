export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    original_price: number;
    brand: string;
    rating: number;
    review_count: number;
    stock: number;
    tags: string[];
    images: string[];
    category_slug: string;
    created_at: string;
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
    sortBy?: SortBy;
    sortOrder?: SortOptions;
    page?: number;
    limit?: number;
}