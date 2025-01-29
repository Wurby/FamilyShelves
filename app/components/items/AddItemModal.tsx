import { useState } from "react";
import { Text } from "../Text";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { addDays } from "~/utils/Date";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (itemData: {
    name: string;
    quantity: number;
    unit: string;
    expirationDate: Date;
    notes?: string;
    location?: string;
  }) => Promise<void>;
  defaultValues?: {
    unit: string;
    quantity: number;
    expirationDays: number;
    location?: string;
  };
  shelfName: string;
}

export function AddItemModal({
  isOpen,
  onClose,
  onAdd,
  defaultValues = {
    unit: "each",
    quantity: 1,
    expirationDays: 7,
  },
  shelfName,
}: AddItemModalProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(defaultValues.quantity);
  const [unit, setUnit] = useState(defaultValues.unit);
  const [expirationDate, setExpirationDate] = useState(
    addDays(new Date(), defaultValues.expirationDays)
  );
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState(defaultValues.location || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Item name must be at least 2 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        name: name.trim(),
        quantity,
        unit,
        expirationDate,
        notes: notes.trim() || undefined,
        location: location.trim() || undefined,
      });
      setName("");
      setNotes("");
      onClose();
    } catch (error) {
      setError("Failed to add item");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Item to ${shelfName}`}
      isSubmitting={isSubmitting}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="solid"
            disabled={isSubmitting}
            form="addItemForm"
          >
            {isSubmitting ? "Adding..." : "Add Item"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col h-full pb-[env(safe-area-inset-bottom)] pb-keyboard">
        <form
          id="addItemForm"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="flex flex-col gap-2">
              <Text variant="caption">Item Name</Text>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border-2 border-slate-500 rounded-md w-full"
                placeholder="e.g., Milk"
                required
                autoFocus
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <Text variant="caption">Quantity</Text>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="p-2 border-2 border-slate-500 rounded-md w-full"
                min="0"
                step="1"
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <Text variant="caption">Unit</Text>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="p-2 border-2 border-slate-500 rounded-md w-full"
                placeholder="e.g., each, lbs, oz"
                required
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <Text variant="caption">Expiration Date</Text>
            <input
              type="date"
              value={expirationDate.toISOString().split("T")[0]}
              onChange={(e) => setExpirationDate(new Date(e.target.value))}
              className="p-2 border-2 border-slate-500 rounded-md w-full"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <Text variant="caption">Location (Optional)</Text>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="p-2 border-2 border-slate-500 rounded-md w-full"
              placeholder="e.g., Top Shelf"
            />
          </label>

          <label className="flex flex-col gap-2">
            <Text variant="caption">Notes (Optional)</Text>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="p-2 border-2 border-slate-500 rounded-md w-full"
              placeholder="Any additional details..."
              rows={3}
            />
          </label>

          {error && (
            <Text variant="caption" className="text-red-500">
              {error}
            </Text>
          )}
        </form>
      </div>
    </Modal>
  );
}
