interface Subcategory {
    id: string;
    categoryId: string;
    name: string;
    slug: string;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
    description: string;
    image: string;
    createdAt: string;
    subcategories: Subcategory[];
}