-- Revanta Neon migration schema (additive; does not alter or delete Supabase data).
-- Neon Managed Auth owns identity records in neon_auth."user".
CREATE TABLE IF NOT EXISTS public.client_profiles (
  user_id uuid PRIMARY KEY REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  full_name text,
  business_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.client_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 150),
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning','in_progress','review','ready','live','paused')),
  preview_url text,
  live_url text,
  created_by uuid REFERENCES neon_auth."user"(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.client_project_members (
  project_id uuid NOT NULL REFERENCES public.client_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);
CREATE INDEX IF NOT EXISTS client_project_members_user_idx ON public.client_project_members(user_id);
CREATE INDEX IF NOT EXISTS client_projects_updated_idx ON public.client_projects(updated_at DESC);
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  company text,
  website text,
  industry text,
  budget text,
  form_type text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  page_path text,
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New','Contacted','Meeting Booked','Won','Lost')),
  follow_up_at timestamptz,
  internal_notes text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_created_idx ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_follow_up_idx ON public.leads(follow_up_at) WHERE follow_up_at IS NOT NULL;
CREATE TABLE IF NOT EXISTS public.app_user_roles (
  user_id uuid PRIMARY KEY REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('staff','client')),
  created_at timestamptz NOT NULL DEFAULT now()
);
