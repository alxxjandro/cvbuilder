# Supabase integration

The app supports two interchangeable backends, chosen at startup by
`isSupabaseEnabled` in `src/lib/supabase.ts`:

- **Mock path** (no env configured): auth resolves to a hardcoded user and the
  CV library lives in `localStorage`, seeded with sample CVs. Used by tests and
  offline development.
- **Supabase path** (env configured): Google OAuth for sign-in and a Postgres
  `cvs` table (with RLS) for the library.

Both paths share the same store actions, so no UI/component code branches on the
backend.

## 1. Configuration

`.env.local` holds the project credentials (already created, git-ignored):

```
VITE_SUPABASE_URL=https://oiahngqgglwjdgrjmjgv.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

The publishable key (`sb_publishable_...`) is preferred over the legacy anon
key; both are safe to ship to the browser. `src/lib/supabase.ts` builds a
schema-typed client (`src/lib/database.types.ts`) when these are present.

## 2. Auth seam

- `src/state/authStore.ts` builds the store in Supabase mode (`signIn` ->
  `supabase.auth.signInWithOAuth({ provider: "google" })`; `signOut` ->
  `supabase.auth.signOut()`) or mock mode. A `ready` flag is exposed so the
  route guard does not flash the landing page during the post-OAuth round trip.
- `src/lib/session.ts` (`initSession`, called from `main.tsx`) subscribes to
  `supabase.auth.onAuthStateChange`, maps the Google profile into the store's
  `User` shape, and loads the library on sign-in.
- `GoogleButton` lets the OAuth redirect handle navigation in Supabase mode and
  navigates manually only in mock mode.

## 3. Data seam

`src/state/libraryStore.ts` keeps the same actions (`create`, `duplicate`,
`rename`, `remove`, `save`) and, in Supabase mode, mirrors each change to the
`cvs` table. Edits update local state immediately (optimistic) and `save` is
debounced (~800 ms) so editing does not issue a network write per keystroke.
`load()` hydrates the library from the account; `useHydrated` reports readiness
from the store's `loaded` flag (Supabase) or persist hydration (mock).

### Schema (applied via migrations)

```sql
create table public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null default 'Untitled CV',
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index cvs_user_id_idx on public.cvs (user_id);
alter table public.cvs enable row level security;
```

RLS: one policy per operation, all `to authenticated` with
`(select auth.uid()) = user_id`; the update policy carries both `using` and
`with check`. `user_id` defaults to `auth.uid()`, so inserts never send it from
the client. The `data` column maps directly to `CVData`.

### Migration of existing local CVs

On the first sign-in of an empty account, `session.ts` imports any CVs left in
the `currio-library` localStorage key into the account, then clears the local
copy.

## 4. Remaining manual setup (Supabase dashboard + Google Cloud)

These cannot be done over the API and must be configured once by a project
owner:

1. **Google Cloud Console** -> create an OAuth 2.0 Client ID (Web application).
   - Authorized redirect URI:
     `https://oiahngqgglwjdgrjmjgv.supabase.co/auth/v1/callback`
2. **Supabase dashboard -> Authentication -> Providers -> Google**: enable it
   and paste the Client ID and Client Secret.
3. **Supabase dashboard -> Authentication -> URL Configuration**:
   - Site URL: your production URL (and `http://localhost:5173` for dev).
   - Redirect URLs: add `http://localhost:5173/dashboard` and the production
     `/dashboard` equivalent (the app requests `${origin}/dashboard`).

Until step 1-2 are done, clicking "Continue with Google" will return a
"provider is not enabled" error from Supabase.
