import { NextResponse } from 'next/server'
import { getAuthenticatedClient } from '@/src/utils/supabase/auth'
import { isSupabaseConfigured } from '@/src/utils/supabase/config'
import { isLearnerProfile } from '@/src/utils/learner-profile'
import { readJsonBody } from '@/src/utils/read-json'

export const dynamic = 'force-dynamic'

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
}

export async function GET() {
  if (!isSupabaseConfigured()) return json({ error: 'Backend is not configured.' }, 503)
  const auth = await getAuthenticatedClient()
  if (!auth) return json({ error: 'Sign in to access your learner profile.' }, 401)

  const { data, error } = await auth.supabase
    .from('profiles')
    .select('id, level, age_group, interests, goals, updated_at')
    .eq('id', auth.userId)
    .maybeSingle()

  if (error) {
    console.error('Could not load learner profile:', error.message)
    return json({ error: 'Your learner profile could not be loaded.' }, 500)
  }

  const claims = auth.claims as Record<string, unknown>;
  const userMetadata = typeof claims.user_metadata === 'object' && claims.user_metadata !== null
    ? claims.user_metadata as Record<string, unknown>
    : {};
  const email = typeof claims.email === 'string' ? claims.email : '';
  const fullName = typeof userMetadata.full_name === 'string'
    ? userMetadata.full_name
    : typeof claims.name === 'string' ? claims.name : '';

  return json({
    user: { email, fullName },
    profile: data ? {
      level: data.level,
      ageGroup: data.age_group,
      interests: data.interests,
      goals: data.goals,
      updatedAt: data.updated_at,
    } : null,
  })
}

export async function PUT(request: Request) {
  if (!isSupabaseConfigured()) return json({ error: 'Backend is not configured.' }, 503)
  const auth = await getAuthenticatedClient()
  if (!auth) return json({ error: 'Sign in to save your learner profile.' }, 401)
  const parsed = await readJsonBody(request, 8_192)
  if (parsed.error === 'too_large') return json({ error: 'Profile data is too large.' }, 413)
  if (parsed.error) return json({ error: 'Send a valid JSON profile.' }, 400)
  const body = parsed.value
  if (!isLearnerProfile(body)) return json({ error: 'Check your learning level, age group, interests and goals.' }, 400)

  const { data, error } = await auth.supabase
    .from('profiles')
    .upsert({
      id: auth.userId,
      level: body.level,
      age_group: body.ageGroup,
      interests: body.interests,
      goals: body.goals,
    }, { onConflict: 'id' })
    .select('id, level, age_group, interests, goals, updated_at')
    .single()

  if (error) {
    console.error('Could not save learner profile:', error.message)
    return json({ error: 'Your learner profile could not be saved.' }, 500)
  }

  return json({ profile: {
    level: data.level,
    ageGroup: data.age_group,
    interests: data.interests,
    goals: data.goals,
    updatedAt: data.updated_at,
  } })
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) return json({ error: 'Backend is not configured.' }, 503)
  const auth = await getAuthenticatedClient()
  if (!auth) return json({ error: 'Sign in to update your account profile.' }, 401)

  const parsed = await readJsonBody(request, 4_096)
  if (parsed.error === 'too_large') return json({ error: 'Profile details are too large.' }, 413)
  if (parsed.error || !parsed.value || typeof parsed.value !== 'object') return json({ error: 'Send valid profile details.' }, 400)

  const body = parsed.value as Record<string, unknown>
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
  if (fullName.length < 2 || fullName.length > 80) {
    return json({ error: 'Enter a name between 2 and 80 characters.' }, 400)
  }

  const { data, error } = await auth.supabase.auth.updateUser({
    data: { full_name: fullName },
  })

  if (error || !data.user) {
    console.error('Could not update account profile:', error?.message)
    return json({ error: 'Your name could not be saved. Please try again.' }, 500)
  }

  return json({
    user: {
      email: data.user.email ?? '',
      fullName: typeof data.user.user_metadata?.full_name === 'string' ? data.user.user_metadata.full_name : fullName,
    },
  })
}
