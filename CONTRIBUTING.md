# Contributing

## Code conventions

- Use TypeScript for application code and keep strict type checking enabled.
- Use two spaces for indentation, descriptive names, and small functions with explicit inputs and outputs.
- Validate and bound request data at API boundaries. Return generic user-facing errors and keep sensitive diagnostics in server logs.
- Keep client components focused on interaction; perform authorization and privileged data access on the server.
- Use semantic HTML, keyboard-accessible controls, and responsive layouts. Check narrow screens when changing shared or dashboard UI.

## Supabase changes

- Add schema changes as a new, ordered SQL migration under `supabase/migrations/`; do not edit an already applied migration.
- Enable RLS on every exposed table and grant only the roles and operations the app needs.
- Scope private learner data with `auth.uid()` in both `USING` and `WITH CHECK` policies. Keep service-role and secret keys out of browser code and `NEXT_PUBLIC_` variables.
- Apply and inspect migrations on a development project before production. Verify the resulting tables, policies, and Supabase security/performance advisories.
- Keep Auth redirect URLs limited to the local and deployed origins the app uses, and enable leaked-password protection for production.

## Before deployment

Run `npm run lint` and `npm run build`. Review the diff, confirm environment variables are configured in the hosting provider, and verify sign-in, sign-out, profile persistence, and lesson progress with separate learner accounts.
