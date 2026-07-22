// Login Page — Authentication page with email/password login

import { useAuth } from '@core/auth';
import { Alert, Button, Card, Input } from '@shared/components';
import { AuthLayout } from '@shared/layouts';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

export function LoginPage() {
  const { signIn, isLoading: _authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsSubmitting(true);

    const result = await signIn(email, password);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    // Navigation happens automatically via LoginRoute redirect
    setIsSubmitting(false);
  };

  return (
    <AuthLayout>
      <Card padding="lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your BUDI account to continue</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4">
            <Alert variant="error" message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {/* Login Form */}
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

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={isSubmitting}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              Remember me
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-sm font-medium text-brand-600 hover:text-brand-500"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
            Sign In
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
