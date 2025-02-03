CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE);


CREATE INDEX IF NOT EXISTS user_email_idx ON "user"(email);


CREATE TABLE IF NOT EXISTS "session" (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    expires_at INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS "email_verification_request" (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS "password_reset_session" (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(id),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    email_verified INTEGER NOT NULL DEFAULT 0
);