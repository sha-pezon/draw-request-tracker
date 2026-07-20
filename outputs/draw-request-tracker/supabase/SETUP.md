# Supabase Free Setup For Pezon Construction Draw Tracker

1. Create a free Supabase project.
2. Open the Supabase SQL Editor and run `supabase/schema.sql`.
3. In Authentication settings, enable Email provider with email confirmations.
4. Add the live tracker URL to allowed redirect URLs.
   For Vercel, use the production URL Vercel gives you, for example:
   `https://your-project-name.vercel.app`
   The current prototype URL is:
   `https://draw-request-tracker.shahir568344.chatgpt.site`
5. Copy the project URL and anon public key from Project Settings > API.
6. Set these hosting environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `COMPANY_DOMAIN=pezonproperties.com`
7. Redeploy the hosted tracker.

The anon key is safe to expose in browser apps when Row Level Security is enabled.
The schema restricts shared tracker access to authenticated users whose email ends in `@pezonproperties.com`.
New users create an account once, confirm their email, then sign in with email and password.

For v1, draw records are stored as one shared JSON state row plus a separate activity log table.
That keeps the free version simple. Later, the same project can be migrated into fully relational tables for reporting.
