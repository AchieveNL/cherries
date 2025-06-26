'use client';

import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="text-primary hover:text-primary/90 font-medium">
          {actionText}
        </button>
      )}
    </div>
  );
}
