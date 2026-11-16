import { createClient } from './server'

export async function getAuthenticatedClient(request?: Request) {
  const supabase = await createClient(request)
  const authorization = request?.headers.get('authorization')
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  const { data, error } = await supabase.auth.getClaims(accessToken)
  const userId = data?.claims?.sub

  if (error || !data || typeof userId !== 'string') return null
  return { supabase, userId, claims: data.claims }
}
