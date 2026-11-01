import { NextResponse } from 'next/server'
import { getAuthenticatedClient } from '@/src/utils/supabase/auth'
import { isSupabaseConfigured } from '@/src/utils/supabase/config'
import { readJsonBody } from '@/src/utils/read-json'

export const dynamic = 'force-dynamic'

const lessonIds = new Set(['p7-maths-equivalent-fractions'])

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
}

export async function GET() {
  if (!isSupabaseConfigured()) return json({ error: 'Backend is not configured.' }, 503)
  const auth = await getAuthenticatedClient()
  if (!auth) return json({ error: 'Sign in to access your learning progress.' }, 401)

  const { data, error } = await auth.supabase
    .from('lesson_progress')
    .select('lesson_id, status, score, completed_at, updated_at')
    .eq('user_id', auth.userId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Could not load lesson progress:', error.message)
    return json({ error: 'Your learning progress could not be loaded.' }, 500)
  }

  return json({ progress: data.map((item) => ({
    lessonId: item.lesson_id,
    status: item.status,
    score: item.score,
    completedAt: item.completed_at,
    updatedAt: item.updated_at,
  })) })
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return json({ error: 'Backend is not configured.' }, 503)
  const auth = await getAuthenticatedClient()
  if (!auth) return json({ error: 'Sign in to save learning progress.' }, 401)
  const parsed = await readJsonBody(request, 2_048)
  if (parsed.error === 'too_large') return json({ error: 'Progress data is too large.' }, 413)
  if (parsed.error || !parsed.value || typeof parsed.value !== 'object') return json({ error: 'Send valid JSON progress data.' }, 400)
  const body = parsed.value as { lessonId?: unknown; score?: unknown }
  if (typeof body.lessonId !== 'string' || !lessonIds.has(body.lessonId)) return json({ error: 'That lesson is not available for progress tracking.' }, 400)
  if (!Number.isInteger(body.score) || Number(body.score) < 2 || Number(body.score) > 3) return json({ error: 'A passing score of at least 2 is required to complete this lesson.' }, 400)

  const now = new Date().toISOString()
  const { error } = await auth.supabase
    .from('lesson_progress')
    .upsert({
      user_id: auth.userId,
      lesson_id: body.lessonId,
      status: 'completed',
      score: body.score,
      completed_at: now,
    }, { onConflict: 'user_id,lesson_id' })

  if (error) {
    console.error('Could not save lesson progress:', error.message)
    return json({ error: 'Your learning progress could not be saved.' }, 500)
  }

  return json({ success: true, lessonId: body.lessonId, score: body.score, completedAt: now })
}
