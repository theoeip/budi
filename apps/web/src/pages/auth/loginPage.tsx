// Login Page — Authentication page with email/password login

import { useAuth } from '@core/auth';
import { Alert, Button, Card, Input } from '@shared/components';
import { AuthLayout } from '@shared/layouts';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

export function LoginPage() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.trim()) {
      setError('Email wajib diisi');
      return;
    }
    if (!password) {
      setError('Kata sandi wajib diisi');
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
          <h1 className="text-2xl font-bold text-gray-900">Selamat Datang Kembali</h1>
          <p className="mt-2 text-sm text-gray-600">Masuk ke akun BUDI Anda untuk melanjutkan</p>
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
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
            disabled={isSubmitting}
          />

          <Input
            label="Kata Sandi"
            type="password"
            placeholder="Masukkan kata sandi Anda"
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
              Ingat saya
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-sm font-medium text-brand-600 hover:text-brand-500"
            >
              Lupa kata sandi?
            </Link>
          </div>

          <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
            Masuk
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
