-- BUMP BUDDY: tabelas da loja com prefixo bump_, para poder dividir o banco com outras lojas.
-- Mesmo esquema da BEAM RIVALS. Rode uma vez no SQL Editor do Supabase (é idempotente).

-- Funil de visitas (gravado pelo servidor).
CREATE TABLE IF NOT EXISTS public.bump_funnel_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  event_type text NOT NULL,
  path text,
  bundle_id text,
  bundle_name text,
  value numeric,
  referrer text,
  user_agent text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bump_funnel_events_created_at_idx ON public.bump_funnel_events (created_at DESC);
CREATE INDEX IF NOT EXISTS bump_funnel_events_session_idx ON public.bump_funnel_events (session_id);
CREATE INDEX IF NOT EXISTS bump_funnel_events_type_idx ON public.bump_funnel_events (event_type);

-- Configurações públicas (WhatsApp, cartão ligado, logo): a vitrine lê com a chave pública.
CREATE TABLE IF NOT EXISTS public.bump_site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.bump_site_settings (key, value) VALUES ('whatsapp_enabled', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Chaves dos gateways, UTMify, RotaSync etc. Só o servidor.
CREATE TABLE IF NOT EXISTS public.bump_private_settings (
  key text PRIMARY KEY,
  value text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Pedidos (Pix e cartão). Só o servidor.
CREATE TABLE IF NOT EXISTS public.bump_pix_orders (
  id text PRIMARY KEY,
  status text NOT NULL DEFAULT 'waiting_payment',
  amount_cents integer NOT NULL,
  customer jsonb NOT NULL,
  bundle_id text NOT NULL,
  bundle_name text NOT NULL,
  utm jsonb,
  fbp text,
  fbc text,
  ip text,
  ua text,
  url text,
  paid_reported_at timestamptz,
  report_result jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bump_pix_orders_created_at_idx ON public.bump_pix_orders (created_at DESC);

-- Catálogo (cadastro e importação pelo /admin). Só o servidor; a vitrine lê por server function.
CREATE TABLE IF NOT EXISTS public.bump_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  image text,
  sort integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bump_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handle text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  product_type text,
  vendor text,
  tags text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft')),
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  images text[] NOT NULL DEFAULT '{}',
  sort integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bump_product_collections (
  product_id uuid NOT NULL REFERENCES public.bump_products(id) ON DELETE CASCADE,
  collection_id uuid NOT NULL REFERENCES public.bump_collections(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, collection_id)
);

CREATE TABLE IF NOT EXISTS public.bump_product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.bump_products(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  option_values text[] NOT NULL DEFAULT '{}',
  sku text,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price numeric(10, 2),
  stock integer,
  image text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, option_values)
);
CREATE UNIQUE INDEX IF NOT EXISTS bump_product_variants_sku_key ON public.bump_product_variants (lower(sku))
  WHERE sku IS NOT NULL AND sku <> '';
CREATE INDEX IF NOT EXISTS bump_product_variants_product_idx ON public.bump_product_variants (product_id);
CREATE INDEX IF NOT EXISTS bump_product_collections_collection_idx ON public.bump_product_collections (collection_id);

-- Permissões: tudo pelo servidor (service_role); a chave pública só lê bump_site_settings.
ALTER TABLE public.bump_funnel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bump_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bump_private_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bump_pix_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bump_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bump_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bump_product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bump_product_variants ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.bump_funnel_events, public.bump_private_settings, public.bump_pix_orders,
  public.bump_collections, public.bump_products, public.bump_product_collections,
  public.bump_product_variants, public.bump_site_settings FROM anon, authenticated;
GRANT ALL ON public.bump_funnel_events, public.bump_site_settings, public.bump_private_settings,
  public.bump_pix_orders, public.bump_collections, public.bump_products,
  public.bump_product_collections, public.bump_product_variants TO service_role;

GRANT SELECT ON public.bump_site_settings TO anon, authenticated;
DROP POLICY IF EXISTS "Public can read bump site settings" ON public.bump_site_settings;
CREATE POLICY "Public can read bump site settings" ON public.bump_site_settings
  FOR SELECT TO anon, authenticated USING (true);

-- Painel ao vivo do /admin.
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.bump_funnel_events;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
ALTER TABLE public.bump_funnel_events REPLICA IDENTITY FULL;

-- Fotos enviadas pelo /admin: bucket público para leitura; só o servidor grava.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bump-produtos',
  'bump-produtos',
  true,
  5242880,
  ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/avif', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;
