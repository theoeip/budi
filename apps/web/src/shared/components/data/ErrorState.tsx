
import { Alert } from '../ui/alert';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Error', message, onRetry }: ErrorStateProps) {
  return (
    <div className="p-6">
      <Alert variant="error" message={title} description={message} />
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-sm font-medium text-brand-600 hover:text-brand-500"
        >
          Try again
        </button>
      )}
    </div>
  );
}
