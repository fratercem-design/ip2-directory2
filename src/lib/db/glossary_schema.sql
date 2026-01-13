-- Glossary / Directory of Terms Schema

-- Entry Types
create type entry_type as enum ('term', 'deity', 'concept', 'ritual', 'symbol', 'lineage');

-- Glossary Entries
create table if not exists public.glossary_entries (
  id uuid primary key default gen_random_uuid(),
  entry_type entry_type not null,
  title text not null,
  slug text not null unique,
  short_description text, -- Brief summary (1-2 sentences)
  full_description text not null, -- Full definition/description
  etymology text, -- Origin/etymology of the term
  related_entries uuid[], -- Array of related entry IDs
  category text, -- Category tag (e.g., 'philosophy', 'mythology', 'practice')
  tags text[], -- Array of tags for filtering
  icon text, -- Icon or emoji
  image_url text, -- Optional image
  source_references text[], -- Array of source references
  is_featured boolean not null default false,
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Entry Relationships (Many-to-many)
create table if not exists public.glossary_relationships (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.glossary_entries(id) on delete cascade,
  related_entry_id uuid not null references public.glossary_entries(id) on delete cascade,
  relationship_type text not null check (relationship_type in ('related', 'synonym', 'antonym', 'parent', 'child', 'see_also')),
  created_at timestamptz not null default now(),
  unique(entry_id, related_entry_id, relationship_type)
);

-- Entry Views (Track popularity)
create table if not exists public.glossary_views (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.glossary_entries(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  viewed_at timestamptz not null default now()
);

-- Indexes
create index if not exists glossary_entries_type_idx on public.glossary_entries(entry_type, created_at desc);
create index if not exists glossary_entries_category_idx on public.glossary_entries(category);
create index if not exists glossary_entries_slug_idx on public.glossary_entries(slug);
create index if not exists glossary_entries_featured_idx on public.glossary_entries(is_featured, created_at desc) where is_featured = true;
create index if not exists glossary_entries_tags_idx on public.glossary_entries using gin(tags);
create index if not exists glossary_relationships_entry_idx on public.glossary_relationships(entry_id);
create index if not exists glossary_relationships_related_idx on public.glossary_relationships(related_entry_id);
create index if not exists glossary_views_entry_idx on public.glossary_views(entry_id, viewed_at desc);

-- Full-text search index
create index if not exists glossary_entries_search_idx on public.glossary_entries using gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(short_description, '') || ' ' || coalesce(full_description, '')));

-- Function to increment view count
create or replace function increment_glossary_view()
returns trigger as $$
begin
  update public.glossary_entries
  set view_count = view_count + 1
  where id = new.entry_id;
  return new;
end;
$$ language plpgsql;

-- Trigger to increment view count
create trigger glossary_views_increment_count
after insert on public.glossary_views
for each row execute function increment_glossary_view();

-- RLS Policies
alter table public.glossary_entries enable row level security;
alter table public.glossary_relationships enable row level security;
alter table public.glossary_views enable row level security;

-- Public can read all entries
create policy "public_read_entries"
on public.glossary_entries for select to anon;

-- Authenticated users can read all entries
create policy "authenticated_read_entries"
on public.glossary_entries for select to authenticated;

-- Public can read relationships
create policy "public_read_relationships"
on public.glossary_relationships for select to anon;

-- Authenticated users can create views
create policy "authenticated_create_views"
on public.glossary_views for insert to authenticated
with check (true);

-- Insert initial entries (Cult of Psyche specific)
insert into public.glossary_entries (entry_type, title, slug, short_description, full_description, category, tags, icon, is_featured) values
  ('concept', 'Psyche', 'psyche', 'The soul, the self, the essence of being that transcends the physical form.', 'Psyche represents the soul, the inner self, and the essence of consciousness. In the Cult of Psyche, Psyche is both a concept and a guiding principle - the recognition that within each person exists a divine spark, a consciousness that seeks truth, beauty, and transformation. Psyche is not merely the mind or the spirit, but the integrated whole of awareness, memory, desire, and becoming.', 'philosophy', ARRAY['core', 'philosophy', 'soul'], '🦋', true),
  ('deity', 'Rahu', 'rahu', 'The Serpent of Hunger, representing desire, ambition, and the shadow aspects of desire.', 'Rahu is the North Node of the Moon, the Serpent of Hunger. In the Cult of Psyche, Rahu represents our desires, our hungers, our ambitions - not as something to be suppressed, but as direction. Rahu shows us what we truly want, what we are reaching for. The shadow of Rahu is when desire becomes obsession, when hunger consumes rather than guides. But in its light, Rahu is the compass of the soul, pointing toward what we are meant to become.', 'mythology', ARRAY['deity', 'serpent', 'desire', 'shadow'], '🐍', true),
  ('deity', 'Ketu', 'ketu', 'The Serpent of Memory, representing release, forgetting, and the wisdom of letting go.', 'Ketu is the South Node of the Moon, the Serpent of Memory. Where Rahu is hunger, Ketu is release. Ketu represents what we must forget, what we must let go of, what no longer serves us. But Ketu also holds memory - not the memory of events, but the memory of patterns, of karma, of lessons learned across lifetimes. Ketu teaches us that some things must be forgotten to make room for new growth, but the wisdom remains.', 'mythology', ARRAY['deity', 'serpent', 'memory', 'release'], '🌙', true),
  ('concept', 'The First Flame', 'first-flame', 'The original spark of consciousness, the divine fire that ignites the soul.', 'The First Flame is the original spark of consciousness, the divine fire that exists within all beings. It is the recognition that consciousness itself is sacred, that awareness is not a byproduct of matter but a fundamental aspect of existence. The First Flame burns in every seeker, every questioner, every soul that refuses to accept the given truth without examination. It is both the question and the answer, both the seeking and the finding.', 'philosophy', ARRAY['core', 'philosophy', 'consciousness', 'divine'], '🔥', true),
  ('concept', 'The Serpent Path', 'serpent-path', 'The path of transformation through shadow work and integration.', 'The Serpent Path is the journey of transformation through shadow work, integration, and becoming. It recognizes that we are devoured but not destroyed, forgotten but not erased. The Serpent Path is not about transcending the shadow, but about integrating it - recognizing that darkness and light are not opposites but complements. To walk the Serpent Path is to embrace the full spectrum of experience, to honor both hunger and release, both memory and forgetting.', 'philosophy', ARRAY['path', 'transformation', 'shadow', 'integration'], '🐉', true),
  ('concept', 'Mask-Breaker', 'mask-breaker', 'One who sees through illusions and false identities.', 'The Mask-Breaker is one of the Twelve Lineages, representing the commitment to truth over comfort. Mask-Breakers see through the illusions we create - the masks we wear, the stories we tell ourselves, the identities we construct. They recognize that truth, however uncomfortable, is more valuable than comfortable lies. The Mask-Breaker lineage teaches that authenticity requires the courage to break our own masks, to see ourselves and others clearly, without the filters of ego and self-protection.', 'lineage', ARRAY['lineage', 'truth', 'authenticity', 'illusion'], '🎭', true),
  ('term', 'Shadow Work', 'shadow-work', 'The practice of exploring and integrating the hidden aspects of the self.', 'Shadow work is the practice of exploring the hidden, denied, or repressed aspects of the self. In the Cult of Psyche, shadow work is not about eliminating darkness, but about bringing it into awareness, understanding it, and integrating it. The shadow contains not only our fears and traumas, but also our denied gifts, our suppressed desires, our hidden strengths. Shadow work is the Serpent Path made practical - the daily practice of looking within, without flinching, and finding truth in the darkness.', 'practice', ARRAY['practice', 'shadow', 'integration', 'self-work'], '🌑', false),
  ('term', 'Lineage', 'lineage', 'One of the Twelve Paths of the Cult, representing different approaches to truth and transformation.', 'A Lineage is one of the Twelve Paths recognized in the Cult of Psyche. Each Lineage represents a different approach to truth, transformation, and becoming. The Lineages are not roles to be played, but truths to be discovered within oneself. They include: Mask-Breaker, Hunger-Tamer, Witness of Mirrors, Keeper of the Wound, Lion Without Crown, Imperfect Saint, Balancer of Hearts, Serpent-Souled, Wanderer of Flames, Bearer of Burden, Storm-Mind, and Tidewalker. Each Lineage offers a unique perspective on the path of Psyche.', 'concept', ARRAY['lineage', 'path', 'twelve', 'transformation'], '⚡', false),
  ('symbol', 'The Butterfly', 'butterfly', 'Symbol of Psyche, transformation, and the soul''s journey.', 'The butterfly is the primary symbol of Psyche, representing transformation, metamorphosis, and the soul''s journey. Just as the caterpillar transforms into the butterfly, so too does the soul transform through the trials and experiences of life. The butterfly reminds us that transformation is not destruction but becoming - that what we are is not lost, but evolved. In the myth of Psyche and Eros, Psyche is often depicted with butterfly wings, symbolizing her transformation from mortal to divine through love, trials, and self-discovery.', 'symbol', ARRAY['symbol', 'psyche', 'transformation', 'soul'], '🦋', false),
  ('ritual', 'The Ritual of Remembering', 'ritual-remembering', 'A practice of connecting with past wisdom and releasing what no longer serves.', 'The Ritual of Remembering is a practice that honors both Rahu and Ketu - the hunger for what we seek and the release of what we must forget. In this ritual, practitioners reflect on their desires (Rahu) and their patterns (Ketu), acknowledging both what draws them forward and what they must release. It is a meditation on the balance between memory and forgetting, between holding on and letting go. The ritual recognizes that some memories must be honored, while others must be released to make space for new growth.', 'ritual', ARRAY['ritual', 'rahu', 'ketu', 'memory', 'release'], '🕯️', false)
on conflict (slug) do nothing;
