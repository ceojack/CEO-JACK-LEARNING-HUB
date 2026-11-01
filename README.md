# CEO JACK LEARNING HUB

The Learning Hub is a Next.js App Router site with optional Supabase authentication and database persistence. When Supabase is not configured, the learner profile and sample lesson use browser storage for local demos. Account access is disabled rather than simulated.

## Local development

Requirements: Node.js 20+ and npm.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set the keys for the services you want to use.
4. Start the app with `npm run dev` and open `http://localhost:3000`.

## Supabase setup

Create a Supabase project, then set these values in `.env.local` and in the hosting provider's environment settings:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

The publishable key is designed for browser use. Never put a Supabase secret or service-role key in a `NEXT_PUBLIC_` variable or in client code. The app uses signed-in user sessions and Postgres Row Level Security; it does not need a service-role key.

Apply `supabase/migrations/202610310001_initial_learner_backend.sql` to the project using the Supabase SQL Editor or Supabase CLI. It creates the learner profile and lesson progress tables, grants access only to authenticated users, and adds policies that scope each operation to `auth.uid()`.

In Supabase Authentication settings:

- Set the site URL to the deployed site origin.
- Add local and deployed `/auth/callback` URLs to the allowed redirect URLs.
- Enable Google OAuth and configure the provider credentials if Google sign-in should be available.
- Choose and document email confirmation and password policies before inviting learners.

After applying the migration and Auth settings, create an account, confirm it if required, complete onboarding, and finish the sample lesson. The dashboard reads the saved profile and completion across sessions. The account sign-out control clears the Supabase session.

## Backend routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/profile` | `GET` | Read the signed-in learner's profile |
| `/api/profile` | `PUT` | Validate and upsert profile choices |
| `/api/progress` | `GET` | Read the signed-in learner's lesson results |
| `/api/progress` | `POST` | Save a passing result for an allow-listed lesson |
| `/auth/callback` | `GET` | Exchange the Supabase PKCE code for a cookie session |
| `/auth/signout` | `POST` | Sign out and clear the session |

Private pages verify signed claims on the server. The Next.js 16 `src/proxy.ts` refreshes Supabase cookies; API handlers independently authenticate requests, validate payloads, and rely on database RLS as a second authorization boundary.

## Other services

Set `GROQ_API_KEY` to enable CEO JACK AI. AI conversation history and work plans remain on the learner's device; they are not included in Supabase persistence.

## Checks

Run `npm run lint` and `npm run build` before deployment. Review deployment logs and configure Supabase redirect URLs for the exact production origin.

## Production launch gates

- Apply the migration to the production project and verify that two separate accounts cannot read or change one another's rows.
- Test email confirmation, sign-in, Google OAuth, sign-out, and expired-session refresh against the deployed origin.
- Before onboarding children, implement and verify the required parent or guardian consent process. The current site does not verify that consent.
- Add a documented account deletion and data export workflow, and set an abuse limit for the AI route before broad public access.
- Review the Privacy Policy and Terms against the actual provider configuration, retention, consent and support process.
