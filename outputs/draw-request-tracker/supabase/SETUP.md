# Supabase Free Setup For DrawOps

1. Create a free Supabase project.
2. Open the Supabase SQL Editor and run `supabase/schema.sql`.
3. In Authentication settings, enable either Email OTP or Google login.
4. Add the live tracker URL to allowed redirect URLs:
   `https://draw-request-tracker.shahir568344.chatgpt.site`
5. Copy the project URL and anon public key from Project Settings > API.
6. Set these hosting environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `COMPANY_DOMAIN=pezonproperties.com`
7. Redeploy the hosted tracker.

The anon key is safe to expose in browser apps when Row Level Security is enabled.
The schema restricts shared tracker access to authenticated users whose email ends in `@pezonproperties.com`.

For v1, draw records are stored as one shared JSON state row plus a separate activity log table.
That keeps the free version simple. Later, the same project can be migrated into fully relational tables for reporting.
