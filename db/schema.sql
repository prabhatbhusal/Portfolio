-- applied by scripts/db.mjs before every build. every statement is
-- idempotent, so running it twice changes nothing.

-- the one account. sign-up closes for good once a row exists here
create table if not exists users (
  id serial primary key,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- the cookie holds a random token; only its sha-256 is stored, so a leaked
-- table cannot be replayed as a login
create table if not exists sessions (
  token_hash text primary key,
  user_id int not null references users (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- emailed six-digit codes for sign-up and password reset, hashed, short-lived,
-- and capped at five guesses. the password travels with the code, never before
create table if not exists auth_codes (
  email text not null,
  purpose text not null check (purpose in ('signup', 'reset')),
  code_hash text not null,
  attempts int not null default 0,
  expires_at timestamptz not null,
  primary key (email, purpose)
);
alter table auth_codes drop column if exists password_hash;

-- everything editable from the studio. data is validated against the kind's
-- schema before it is written (src/lib/content/kinds.ts)
create table if not exists content (
  kind text not null check (kind in ('post', 'project', 'game', 'photo')),
  slug text not null,
  data jsonb not null,
  sort int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (kind, slug)
);

-- uploaded images, keyed by a hash of their bytes so a re-upload is free.
-- ponytail: images live in postgres; move to object storage if this grows past a few hundred mb
create table if not exists media (
  id text primary key,
  type text not null,
  bytes bytea not null,
  created_at timestamptz not null default now()
);

-- the contact form's inbox. the email goes out too; this is the copy that
-- cannot bounce
create table if not exists messages (
  id serial primary key,
  name text not null,
  email text not null,
  budget text,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- fixed-window counters for login attempts and the contact form. in the
-- database because serverless instances share nothing else
create table if not exists rate_limits (
  key text primary key,
  count int not null,
  reset_at timestamptz not null
);

create table if not exists meta (
  key text primary key,
  value text not null
);
