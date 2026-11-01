import { createClient } from './server'

export async function getAuthenticatedClient() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub

  if (error || !data || typeof userId !== 'string') return null
  return { supabase, userId, claims: data.claims }
}
