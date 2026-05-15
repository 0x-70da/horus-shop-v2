// features/addresses/components/address-form.tsx
import { useState } from "react";
import type { Address, CreateAddressBody } from "../addresses.types";

interface AddressFormProps {
  initialData?: Address;
  onSubmit:     (data: CreateAddressBody) => void;
  isPending:    boolean;
  onCancel:     () => void;
}

const EMPTY_FORM: CreateAddressBody = {
  fullName:    "",
  addressLine: "",
  city:        "",
  state:       "",
  country:     "EG",
  phone:       "",
  zipCode:     "",
  isDefault:   false,
};

export default function AddressForm({
  initialData,
  onSubmit,
  isPending,
  onCancel,
}: AddressFormProps) {
  const [form, setForm] = useState<CreateAddressBody>(
    initialData
      ? {
          fullName:    initialData.full_name,
          addressLine: initialData.address_line,
          city:        initialData.city,
          state:       initialData.state ?? "",
          country:     initialData.country,
          phone:       initialData.phone ?? "",
          zipCode:     initialData.zip_code ?? "",
          isDefault:   initialData.is_default,
        }
      : EMPTY_FORM,
  );

  const handleChange = (field: keyof CreateAddressBody, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            type="text"
            value={form.fullName}
            onChange={e => handleChange("fullName", e.target.value)}
            required
            placeholder="Ahmed Hassan"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Address *</label>
          <input
            type="text"
            value={form.addressLine}
            onChange={e => handleChange("addressLine", e.target.value)}
            required
            placeholder="15 Tahrir Square, Apt 3"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">City *</label>
          <input
            type="text"
            value={form.city}
            onChange={e => handleChange("city", e.target.value)}
            required
            placeholder="Cairo"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">State / Governorate</label>
          <input
            type="text"
            value={form.state}
            onChange={e => handleChange("state", e.target.value)}
            placeholder="Cairo"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Country *</label>
          <select
            value={form.country}
            onChange={e => handleChange("country", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="EG">Egypt</option>
            <option value="SA">Saudi Arabia</option>
            <option value="AE">UAE</option>
            <option value="KW">Kuwait</option>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Zip Code</label>
          <input
            type="text"
            value={form.zipCode}
            onChange={e => handleChange("zipCode", e.target.value)}
            placeholder="11511"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => handleChange("phone", e.target.value)}
            placeholder="+201001234567"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={e => handleChange("isDefault", e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Set as default address</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-black text-white px-6 py-2 rounded text-sm disabled:opacity-50"
        >
          {isPending ? "Saving..." : initialData ? "Update Address" : "Add Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border px-6 py-2 rounded text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}