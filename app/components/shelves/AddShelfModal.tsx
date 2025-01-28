import { useState } from "react";
import { Text } from "../Text";
import { Button } from "../Button";
import { Modal } from "../Modal";

interface AddShelfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (shelfData: { name: string }) => Promise<void>;
}

export function AddShelfModal({ isOpen, onClose, onAdd }: AddShelfModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Shelf name must be at least 2 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({ name: name.trim() });
      setName("");
      onClose();
    } catch (error) {
      setError("Failed to create shelf");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Shelf"
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
            form="addShelfForm"
          >
            {isSubmitting ? "Creating..." : "Create Shelf"}
          </Button>
        </div>
      }
    >
      <form
        id="addShelfForm"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div>
          <label className="flex flex-col gap-2">
            <Text variant="caption">Shelf Name</Text>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border-2 border-slate-500 rounded-md w-full"
              placeholder="e.g., Kitchen Pantry"
              required
              autoFocus
            />
          </label>
          {error && (
            <Text variant="caption" className="text-red-500 mt-1">
              {error}
            </Text>
          )}
        </div>
      </form>
    </Modal>
  );
}
