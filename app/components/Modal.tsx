import { type ReactNode } from "react";
import { Button } from "./Button";
import { Text } from "./Text";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  isSubmitting?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  isSubmitting = false,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
        <Text variant="subtitle" className="mb-4">
          {title}
        </Text>

        {children}

        {footer ?? (
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
