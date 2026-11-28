import { createClient } from './server'
import { isAdminEmail } from './admin'

export async function getAuthenticatedClient(request?: Request) {
  const supabase = await createClient(request)
  const authorization = request?.headers.get('authorization')
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  const { data, error } = await supabase.auth.getClaims(accessToken)
  const userId = data?.claims?.sub

  if (error || !data || typeof userId !== 'string') return null
  const claims = data.claims as Record<string, unknown>
  if (isAdminEmail(claims.email) && claims.aal !== 'aal2') return null
  if (claims.aal !== 'aal2') {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('mfa_enabled')
      .eq('id', userId)
      .maybeSingle()
    if (profileError || profile?.mfa_enabled === true) return null
  }
  return { supabase, userId, claims: data.claims }
}
