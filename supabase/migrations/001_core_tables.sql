-- BUDI Finance Module — Migration 001: Core Tables
-- Creates the foundational tables for multi-tenant school management.
-- Dependencies: auth schema (managed by Supabase)

-- ============================================================
-- 1. schools — Tenant/school entities
-- ============================================================
CREATE TABLE schools (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL,
    address         TEXT,
    phone           VARCHAR(50),
    email           VARCHAR(255),
    logo_url        TEXT,
    website         VARCHAR(255),
    currency        VARCHAR(10) NOT NULL DEFAULT 'IDR',
    timezone        VARCHAR(50) NOT NULL DEFAULT 'Asia/Jakarta',
    fiscal_year_start DATE,
    fiscal_year_end   DATE,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    settings        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_schools_slug ON schools(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_is_active ON schools(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_created_at ON schools(created_at);

-- ============================================================
-- 2. profiles — Extended user profiles linked to auth.users
-- ============================================================
CREATE TABLE profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    avatar_url      TEXT,
    phone           VARCHAR(50),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    last_sign_in_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_profiles_email ON profiles(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_is_active ON profiles(is_active) WHERE deleted_at IS NULL;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. roles — Role definitions
-- ============================================================
CREATE TABLE roles (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code            VARCHAR(50) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    level           INTEGER NOT NULL CHECK (level >= 0),
    is_system       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_roles_code ON roles(code);

-- ============================================================
-- 4. user_roles — Many-to-many user-to-role assignments
-- ============================================================
CREATE TABLE user_roles (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_id         UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,
    UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id) WHERE deleted_at IS NULL;

-- ============================================================
-- 5. school_users — User membership in schools
-- ============================================================
CREATE TABLE school_users (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_id         UUID NOT NULL REFERENCES roles(id),
    is_default      BOOLEAN NOT NULL DEFAULT false,
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,
    UNIQUE(school_id, user_id)
);

CREATE INDEX idx_school_users_school_id ON school_users(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_school_users_user_id ON school_users(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_school_users_role_id ON school_users(role_id) WHERE deleted_at IS NULL;

-- ============================================================
-- 6. system_settings — Configuration key-value store
-- ============================================================
CREATE TABLE system_settings (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID REFERENCES schools(id),
    key             VARCHAR(255) NOT NULL,
    value           JSONB NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(school_id, key)
);

CREATE INDEX idx_system_settings_school_id ON system_settings(school_id);
CREATE INDEX idx_system_settings_key ON system_settings(key);

-- ============================================================
-- Updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Apply updated_at trigger to all core tables
CREATE TRIGGER set_schools_updated_at
    BEFORE UPDATE ON schools
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_school_users_updated_at
    BEFORE UPDATE ON school_users
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

