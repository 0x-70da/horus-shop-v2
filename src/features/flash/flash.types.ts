export interface FlashDeals {
  id: string;
  product_id: string;
  variant_id: string;
  start_date: string;
  end_date: string;
  discount_percent: number;
  deal_quantity: number;
  sold_count: number;
  is_active: boolean;
  created_at: string;
}
