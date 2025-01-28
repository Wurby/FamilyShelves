import { Text } from "../Text";
import { Button } from "../Button";
import { Modal } from "../Modal";
import React from "react";

interface DeleteShelfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  shelfName: string;
}

export function DeleteShelfModal({
  isOpen,
  onClose,
  onDelete,
  shelfName,
}: DeleteShelfModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");
    try {
      await onDelete();
      onClose();
    } catch (error) {
      setError("Failed to delete shelf");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Shelf"
      isSubmitting={isDeleting}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="solid"
            onClick={handleDelete}
            disabled={isDeleting}
            warning
          >
            {isDeleting ? "Deleting..." : "Delete Shelf"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Text>
          Are you sure you want to delete "{shelfName}"? This action cannot be
          undone.
        </Text>
        {error && (
          <Text variant="caption" className="text-red-500">
            {error}
          </Text>
        )}
      </div>
    </Modal>
  );
}
