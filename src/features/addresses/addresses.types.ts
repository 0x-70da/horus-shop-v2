// features/addresses/addresses.types.ts
export interface Address {
  id: string;
  full_name: string;
  address_line: string;
  city: string;
  state: string | null;
  country: string;
  phone: string | null;
  zip_code: string | null;
  is_default: boolean;
}

export interface CreateAddressBody {
  fullName: string;
  addressLine: string;
  city: string;
  state?: string;
  country: string;
  phone?: string;
  zipCode?: string;
  isDefault: boolean;
}

export type UpdateAddressBody = Partial<CreateAddressBody>;
