-- Revanta returning-visitor analytics (additive migration).
-- Analytics starts only after visitors opt in. No IP address or user-agent is stored.
CREATE TABLE IF NOT EXISTS public.website_visitors (
  visitor_id uuid PRIMARY KEY,
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  visit_count integer NOT NULL DEFAULT 0 CHECK (visit_count >= 0),
  consented_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.visitor_sessions (
  session_id uuid PRIMARY KEY,
  visitor_id uuid NOT NULL REFERENCES public.website_visitors(visitor_id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  active_seconds integer NOT NULL DEFAULT 0 CHECK (active_seconds >= 0),
  passive_seconds integer NOT NULL DEFAULT 0 CHECK (passive_seconds >= 0),
  page_paths text[] NOT NULL DEFAULT '{}'::text[]
);

CREATE INDEX IF NOT EXISTS visitor_sessions_visitor_started_idx
  ON public.visitor_sessions(visitor_id, started_at DESC);
CREATE INDEX IF NOT EXISTS website_visitors_last_seen_idx
  ON public.website_visitors(last_seen DESC);

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS visitor_id uuid
  REFERENCES public.website_visitors(visitor_id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS leads_visitor_created_idx
  ON public.leads(visitor_id, created_at DESC)
  WHERE visitor_id IS NOT NULL;
