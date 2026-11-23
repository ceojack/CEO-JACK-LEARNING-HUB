import { NextResponse } from 'next/server'
import { getAuthenticatedClient } from '@/src/utils/supabase/auth'
import { isSupabaseConfigured } from '@/src/utils/supabase/config'
import { isLearnerProfile } from '@/src/utils/learner-profile'
import { readJsonBody } from '@/src/utils/read-json'

export const dynamic = 'force-dynamic'

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
}

function describeDatabaseError(error: unknown) {
  if (typeof error !== 'object' || error === null) return { error: String(error), code: undefined, details: undefined, hint: undefined, column: undefined }
  const value = error as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown }
  const message = typeof value.message === 'string' ? value.message : 'Unknown Supabase error'
  const details = typeof value.details === 'string' ? value.details : undefined
  const hint = typeof value.hint === 'string' ? value.hint : undefined
  const combinedMessage = `${message} ${details ?? ''} ${hint ?? ''}`
  const columnMatch = combinedMessage.match(/column\s+(?:["']?[\w]+["']?\.)?["']?([\w]+)["']?/i)
    ?? combinedMessage.match(/could not find the ["']([^"']+)["'] column/i)
  const reportedColumn = (value as { column?: unknown }).column
  return {
    error: message,
    code: typeof value.code === 'string' ? value.code : undefined,
    details,
    hint,
    column: typeof reportedColumn === 'string' ? reportedColumn : columnMatch?.[1],
  }
}

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) return json({ error: 'Backend is not configured.' }, 503)
  const auth = await getAuthenticatedClient(request)
  if (!auth) return json({ error: 'Sign in to access your learner profile.' }, 401)

  let profile: {
    display_name: string | null
    email: string | null
    level: string | null
    learning_level: string | null
    age_group: string | null
    interests: string[] | null
    goals: string[] | null
    hobby: string | null
    avatar_url: string | null
    jack_ai_memory: string | null
  } | null = null
  try {
    const { data, error } = await auth.supabase
      .from('profiles')
      .select('id, display_name, email, created_at, updated_at, hobby, avatar_url, level, learning_level, age_group, interests, goals, jack_ai_memory')
      .eq('id', auth.userId)
      .maybeSingle()

    if (error) {
      console.error('Could not load account profile:', describeDatabaseError(error))
      return json({ error: 'Your learner profile could not be loaded.' }, 500)
    }
    profile = data
  } catch (error) {
    console.error('Could not load account profile:', describeDatabaseError(error))
    return json({ error: 'Your learner profile could not be loaded.' }, 500)
  }

  const claims = auth.claims as Record<string, unknown>;
  const userMetadata = typeof claims.user_metadata === 'object' && claims.user_metadata !== null
    ? claims.user_metadata as Record<string, unknown>
    : {};
  const email = typeof claims.email === 'string' ? claims.email : '';
  const fullName = profile?.display_name || (typeof userMetadata.full_name === 'string'
    ? userMetadata.full_name
    : typeof userMetadata.name === 'string'
      ? userMetadata.name
      : typeof claims.name === 'string' ? claims.name : '');
  const avatarUrl = typeof userMetadata.avatar_url === 'string'
    ? userMetadata.avatar_url
    : typeof userMetadata.picture === 'string' ? userMetadata.picture : profile?.avatar_url ?? '';

  return json({
    user: { email: email || profile?.email || '', fullName, avatarUrl },
    profile: profile ? {
      displayName: profile.display_name ?? '',
      hobby: profile.hobby ?? '',
      level: profile.level ?? profile.learning_level ?? '',
      learningLevel: profile.learning_level ?? profile.level ?? '',
      ageGroup: profile.age_group ?? '',
      interests: profile.interests ?? [],
      goals: profile.goals ?? [],
      avatarUrl: profile.avatar_url ?? avatarUrl,
      jackAiMemory: profile.jack_ai_memory ?? '',
    } : null,
  })
}

export async function PUT(request: Request) {
  if (!isSupabaseConfigured()) return json({ error: 'Backend is not configured.' }, 503)
  const auth = await getAuthenticatedClient(request)
  if (!auth) return json({ error: 'Sign in to save your learner profile.' }, 401)
  const parsed = await readJsonBody(request, 8_192)
  if (parsed.error === 'too_large') return json({ error: 'Profile data is too large.' }, 413)
  if (parsed.error) return json({ error: 'Send a valid JSON profile.' }, 400)
  const body = parsed.value
  if (!isLearnerProfile(body)) return json({ error: 'Check your learning level, age group, interests and goals.' }, 400)

  try {
    const claims = auth.claims as Record<string, unknown>
    const metadata = typeof claims.user_metadata === 'object' && claims.user_metadata !== null
      ? claims.user_metadata as Record<string, unknown>
      : {}
    const displayName = typeof metadata.full_name === 'string'
      ? metadata.full_name
      : typeof metadata.name === 'string' ? metadata.name : typeof claims.name === 'string' ? claims.name : ''
    const email = typeof claims.email === 'string' ? claims.email : ''
    const rawHobby = (body as unknown as Record<string, unknown>).hobby
    const rawDisplayName = (body as unknown as Record<string, unknown>).displayName
    const hobby = typeof rawHobby === 'string' ? rawHobby.trim().slice(0, 100) : undefined
    const nameFromRequest = typeof rawDisplayName === 'string' ? rawDisplayName.trim().slice(0, 80) : undefined
    const avatarUrl = typeof metadata.avatar_url === 'string'
      ? metadata.avatar_url
      : typeof metadata.picture === 'string' ? metadata.picture : undefined
    const updatedAt = new Date().toISOString()
    const { data: existingProfile, error: existingProfileError } = await auth.supabase
      .from('profiles')
      .select('display_name, email, hobby, avatar_url, jack_ai_memory')
      .eq('id', auth.userId)
      .maybeSingle()
    if (existingProfileError) {
      console.error('Could not read existing shared profile before saving:', describeDatabaseError(existingProfileError))
      return json({ error: 'Your learner profile could not be saved. Please try again.' }, 500)
    }
    const { data, error } = await auth.supabase
      .from('profiles')
      .upsert({
        id: auth.userId,
        display_name: nameFromRequest || displayName || existingProfile?.display_name || email || undefined,
        email: email || existingProfile?.email || undefined,
        hobby: hobby ?? existingProfile?.hobby ?? '',
        avatar_url: avatarUrl ?? existingProfile?.avatar_url ?? undefined,
        jack_ai_memory: existingProfile?.jack_ai_memory ?? '',
        level: body.level,
        learning_level: body.level,
        age_group: body.ageGroup,
        interests: body.interests,
        goals: body.goals,
        updated_at: updatedAt,
      }, { onConflict: 'id' })
      .select('id, hobby, level, learning_level, age_group, interests, goals, updated_at')
      .single()

    if (error) {
      console.error('Could not save learner profile to Supabase:', describeDatabaseError(error))
      return json({ error: 'Your learner profile could not be saved. Please try again.' }, 500)
    }

    return json({ profile: {
      hobby: data.hobby ?? '',
      level: data.level ?? data.learning_level,
      learningLevel: data.learning_level ?? data.level,
      ageGroup: data.age_group,
      interests: data.interests,
      goals: data.goals,
      updatedAt: data.updated_at,
    } })
  } catch (error) {
    console.error('Could not save learner profile to Supabase:', describeDatabaseError(error))
    return json({ error: 'Your learner profile could not be saved. Please try again.' }, 500)
  }
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) return json({ error: 'Backend is not configured.' }, 503)
  const auth = await getAuthenticatedClient(request)
  if (!auth) return json({ error: 'Sign in to update your account profile.' }, 401)

  const parsed = await readJsonBody(request, 4_096)
  if (parsed.error === 'too_large') return json({ error: 'Profile details are too large.' }, 413)
  if (parsed.error || !parsed.value || typeof parsed.value !== 'object') return json({ error: 'Send valid profile details.' }, 400)

  const body = parsed.value as Record<string, unknown>
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
  if (fullName.length < 2 || fullName.length > 80) {
    return json({ error: 'Enter a name between 2 and 80 characters.' }, 400)
  }

  try {
    const { data, error } = await auth.supabase
      .from('profiles')
      .update({ display_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', auth.userId)
      .select('display_name')
      .maybeSingle()
    if (error || !data) {
      console.error('Could not update shared profile name:', error ?? 'No profile row found.')
      return json({ error: 'Your name could not be saved. Please try again.' }, 500)
    }
    return json({ user: { fullName: data.display_name } })
  } catch (error) {
    console.error('Could not update shared profile name:', error)
    return json({ error: 'Your name could not be saved. Please try again.' }, 500)
  }
}
