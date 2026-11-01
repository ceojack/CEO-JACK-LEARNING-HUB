import { NextResponse } from 'next/server'
import { createClient } from '@/src/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as redirect
  const requestedNext = searchParams.get('next') ?? '/'
  const next = requestedNext.startsWith('/') && !requestedNext.startsWith('//') ? requestedNext : '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL(next, origin))
    }
  }

  // return user to error page with instructions
  const errorUrl = new URL('/auth', origin)
  errorUrl.searchParams.set('error', 'Could not sign in. Please try again.')
  return NextResponse.redirect(errorUrl)
}
