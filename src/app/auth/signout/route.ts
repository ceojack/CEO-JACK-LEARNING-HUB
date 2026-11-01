import { NextResponse } from 'next/server'
import { createClient } from '@/src/utils/supabase/server'
import { isSupabaseConfigured } from '@/src/utils/supabase/config'

export async function POST(request: Request) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  return NextResponse.redirect(new URL('/', request.url), 303)
}
