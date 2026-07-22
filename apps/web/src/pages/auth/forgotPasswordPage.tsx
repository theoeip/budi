// Forgot Password Page — Request password reset email

import { useAuth } from '@core/auth';
import { Alert, Button, Card, Input } from '@shared/components';
import { AuthLayout } from '@shared/layouts';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    const result = await resetPassword(email);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsSuccess(true);
    setIsSubmitting(false);
  };

  return (
    <AuthLayout>
      <Card padding="lg">
        {isSuccess ? (
          /* Success State */
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Check your email</h2>
            <p className="mt-2 text-sm text-gray-600">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="mt-1 text-sm text-gray-500">
              If you don&apos;t see it, check your spam folder.
            </p>
            <Link
              to="/auth/login"
              className="mt-6 inline-block text-sm font-medium text-brand-600 hover:text-brand-500"
            >
              Back to login
            </Link>
          </div>
        ) : (
          /* Form State */
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
              <p className="mt-2 text-sm text-gray-600">
                Enter your email and we&apos;ll send you a reset link
              </p>
            </div>

            {error && (
              <div className="mb-4">
                <Alert variant="error" message={error} onDismiss={() => setError(null)} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                disabled={isSubmitting}
              />

              <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
                Send Reset Link
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/auth/login" className="font-medium text-brand-600 hover:text-brand-500">
                Sign in
              </Link>
            </p>
          </>
        )}
      </Card>
    </AuthLayout>
  );
}
