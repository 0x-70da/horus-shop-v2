export interface CartItem {
    id: string;
    productId: string;
    variantId: string | null;
    quantity: number;
    name: string;
    price: number;
    images: string[];
    stock: number;
    brand?: string;
    variantName: string | null;
    variantPrice?: number;
    currentPrice: number;
    sku?: string | null;
    attributes?: Record<string, unknown> | null;
    variantStock?: number | null;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
    lineTotal?: number;
}

export interface CartResponse {
    cartItems: CartItem[];
    subtotal: number;
    itemCount: number;
}