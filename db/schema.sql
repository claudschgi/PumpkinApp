CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS social;

CREATE TYPE auth.user_role AS ENUM ('admin', 'user');
CREATE TYPE content.difficulty AS ENUM ('easy', 'medium', 'hard');

CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role auth.user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content.pumpkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  latin_name TEXT,
  description TEXT NOT NULL,
  origin TEXT,
  season_start SMALLINT CHECK (season_start BETWEEN 1 AND 12),
  season_end SMALLINT CHECK (season_end BETWEEN 1 AND 12),
  taste_profile TEXT[] NOT NULL DEFAULT '{}',
  texture TEXT[] NOT NULL DEFAULT '{}',
  best_for TEXT[] NOT NULL DEFAULT '{}',
  storage_tips TEXT,
  nutrition JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  servings INTEGER,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  total_time_minutes INTEGER,
  difficulty content.difficulty NOT NULL DEFAULT 'easy',
  diet TEXT[] NOT NULL DEFAULT '{}',
  cuisine TEXT,
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content.ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  allergens TEXT[] NOT NULL DEFAULT '{}',
  default_unit TEXT
);

CREATE TABLE IF NOT EXISTS content.recipe_ingredients (
  recipe_id UUID NOT NULL REFERENCES content.recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES content.ingredients(id) ON DELETE RESTRICT,
  amount NUMERIC,
  unit TEXT,
  note TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (recipe_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS content.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pumpkin', 'recipe', 'general'))
);

CREATE TABLE IF NOT EXISTS content.pumpkin_tags (
  pumpkin_id UUID NOT NULL REFERENCES content.pumpkins(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES content.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (pumpkin_id, tag_id)
);

CREATE TABLE IF NOT EXISTS content.recipe_tags (
  recipe_id UUID NOT NULL REFERENCES content.recipes(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES content.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, tag_id)
);

CREATE TABLE IF NOT EXISTS content.recipe_pumpkins (
  recipe_id UUID NOT NULL REFERENCES content.recipes(id) ON DELETE CASCADE,
  pumpkin_id UUID NOT NULL REFERENCES content.pumpkins(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, pumpkin_id)
);

CREATE TABLE IF NOT EXISTS social.recipe_likes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES content.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS social.recipe_saves (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES content.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, recipe_id)
);
