// features/addresses/addresses.page.tsx
import { useState } from "react";
import { ErrorDisplay } from "@/components/ui/error-display";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddresses } from "./addresses.hooks";
import AddressForm from "./components/address-form";
import type { Address, CreateAddressBody } from "./addresses.types";

export default function AddressesPage() {
  const { addresses, isAddressesLoading, isAddressesError, refetchAddresses } =
    useAddresses();
  const {
    createAddress,
    deleteAddress,
    setDefaultAddress,
    isCreatingAddress,
    isDeletingAddress,
  } = useAddresses();

  const [showForm, setShowForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);

  const handleCreate = (data: CreateAddressBody) => {
    createAddress(data, { onSuccess: () => setShowForm(false) });
  };

  return (
    <div className="container py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        {!showForm && !editingAddr && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            + Add Address
          </button>
        )}
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-4">New Address</h2>
          <AddressForm
            onSubmit={handleCreate}
            isPending={isCreatingAddress}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Error */}
      {isAddressesError && !isAddressesLoading && (
        <ErrorDisplay
          message="Failed to load addresses"
          onRetry={refetchAddresses}
        />
      )}

      {/* Loading */}
      {isAddressesLoading && (
        <div
          className="space-y-4"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <span className="sr-only">Loading addresses...</span>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 rounded" />
                <Skeleton className="h-8 w-24 rounded" />
                <Skeleton className="h-8 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isAddressesLoading &&
        !isAddressesError &&
        addresses.length === 0 &&
        !showForm && (
          <div className="text-center py-10 border rounded-lg">
            <p className="text-muted-foreground mb-3">No addresses yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-black text-white px-4 py-2 rounded text-sm"
            >
              Add Your First Address
            </button>
          </div>
        )}

      {/* Addresses List */}
      {!isAddressesLoading && !isAddressesError && addresses.length > 0 && (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="border rounded-lg p-4">
              {/* Edit Form inline */}
              {editingAddr?.id === addr.id ? (
                <EditAddressInline
                  address={addr}
                  onDone={() => setEditingAddr(null)}
                />
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{addr.full_name}</p>
                        {addr.is_default && (
                          <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {addr.address_line}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {addr.city}
                        {addr.state && `, ${addr.state}`}, {addr.country}
                        {addr.zip_code && ` ${addr.zip_code}`}
                      </p>
                      {addr.phone && (
                        <p className="text-sm text-muted-foreground">
                          {addr.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setEditingAddr(addr)}
                      className="text-sm border px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    {!addr.is_default && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-sm border px-3 py-1 rounded"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      disabled={isDeletingAddress}
                      className="text-sm text-destructive border border-destructive px-3 py-1 rounded disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== Edit Inline Component =====
function EditAddressInline({
  address,
  onDone,
}: {
  address: Address;
  onDone: () => void;
}) {
  const { updateAddress, isUpdatingAddress } = useAddresses(address.id);

  const handleUpdate = (data: CreateAddressBody) => {
    updateAddress(data, { onSuccess: onDone });
  };

  return (
    <div>
      <h3 className="font-medium mb-3">Edit Address</h3>
      <AddressForm
        initialData={address}
        onSubmit={handleUpdate}
        isPending={isUpdatingAddress}
        onCancel={onDone}
      />
    </div>
  );
}
