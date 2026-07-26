
import { Spinner } from '../ui/spinner';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-500">
      <Spinner className="mb-4 h-8 w-8 text-brand-600" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
