-- ====================================================================
-- AZRAQ SHOP — DATABASE MIGRATION 002
-- Customer Accounts, Genuine Google OAuth Identity & Secure Server Sessions
-- ====================================================================

BEGIN;

-- 1. Customer User Records
CREATE TABLE IF NOT EXISTS customer_users (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT,
    password_hash VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_users_email ON customer_users(email);
CREATE INDEX IF NOT EXISTS idx_customer_users_phone ON customer_users(phone);

-- 2. Federated Identity Providers (Google sub identifier mapping)
CREATE TABLE IF NOT EXISTS customer_identities (
    id VARCHAR(100) PRIMARY KEY,
    customer_id VARCHAR(100) NOT NULL REFERENCES customer_users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'google'
    provider_id VARCHAR(255) NOT NULL, -- Google unique 'sub' claim
    email VARCHAR(255),
    profile_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_customer_provider UNIQUE (provider, provider_id)
);

CREATE INDEX IF NOT EXISTS idx_customer_identities_provider ON customer_identities(provider, provider_id);
CREATE INDEX IF NOT EXISTS idx_customer_identities_customer_id ON customer_identities(customer_id);

-- 3. Cryptographically Secure Customer Sessions
CREATE TABLE IF NOT EXISTS customer_sessions (
    id VARCHAR(100) PRIMARY KEY,
    customer_id VARCHAR(100) NOT NULL REFERENCES customer_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 of the 32-byte session token
    ip_address VARCHAR(100),
    user_agent TEXT,
    is_revoked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_sessions_token_hash ON customer_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_customer_sessions_customer_id ON customer_sessions(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_sessions_expires_at ON customer_sessions(expires_at);

COMMIT;
