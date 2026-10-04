import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void; // alias for onClose
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  confirmVariant?: string; // alias for variant
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  confirmVariant,
  isLoading = false,
}) => {
  const resolvedVariant = (confirmVariant as 'danger' | 'warning' | 'primary' | undefined) || variant;
  const handleClose = onClose || onCancel || (() => {});
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      maxWidth="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={resolvedVariant === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3 py-2">
        <div
          className={`p-2.5 rounded-xl shrink-0 ${
            resolvedVariant === 'danger'
              ? 'bg-rose-950/40 text-rose-400 border border-rose-800/40'
              : 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
          }`}
        >
          {resolvedVariant === 'danger' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-sm text-[#F5F0EA] leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  );
};
