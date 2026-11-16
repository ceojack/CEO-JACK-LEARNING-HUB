import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseConfig } from './config'

export async function createClient(request?: Request) {
  const config = getSupabaseConfig()
  if (!config) throw new Error('Supabase is not configured. Add the public Supabase URL and publishable key.')
  const cookieStore = await cookies()
  const authorization = request?.headers.get('authorization')

  return createServerClient(
    config.url,
    config.publishableKey,
    {
      ...(authorization ? { global: { headers: { Authorization: authorization } } } : {}),
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
