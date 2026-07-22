// Shared Config — Frontend-specific configuration

import { FEATURE_FLAGS } from '@budi/config/modules';

/**
 * Check if a feature is enabled via environment variable or config.
 * Environment variables take precedence over the config defaults.
 */
export function isFeatureEnabled(featureCode: keyof typeof FEATURE_FLAGS): boolean {
  const envVar = import.meta.env[`VITE_FEATURE_${featureCode}`];
  if (envVar !== undefined) {
    return envVar === 'true';
  }
  return FEATURE_FLAGS[featureCode] ?? false;
}

/**
 * Get the application environment.
 */
export function getAppEnvironment(): 'development' | 'staging' | 'production' {
  return (import.meta.env.VITE_APP_ENV as 'development' | 'staging' | 'production') ?? 'development';
}

/**
 * Check if running in development mode.
 */
export function isDevelopment(): boolean {
  return getAppEnvironment() === 'development';
}

