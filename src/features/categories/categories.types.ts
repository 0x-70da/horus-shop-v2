interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  products_count: number;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  image: string;
  featured: boolean;
  is_active: boolean;
  subcategories: Subcategory[];
  products_count: number;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  is_active: boolean;
  products_count: number;
  created_at: string;
}
