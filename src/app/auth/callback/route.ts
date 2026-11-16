import { NextResponse } from 'next/server'
import { createClient } from '@/src/utils/supabase/server'

const emailOtpTypes = ['signup', 'invite', 'magiclink', 'recovery', 'email_change', 'email'] as const
type EmailOtpType = (typeof emailOtpTypes)[number]

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return value !== null && emailOtpTypes.includes(value as EmailOtpType)
}

function getSafeNextPath(value: string | null, fallback: string) {
  if (!value) return fallback
  return value.startsWith('/') && !value.startsWith('//') ? value : fallback
}

function redirectWithError(origin: string, isRecovery: boolean, message: string) {
  const destination = isRecovery ? '/auth/update-password' : '/auth'
  const errorUrl = new URL(destination, origin)
  if (!isRecovery) errorUrl.searchParams.set('mode', 'signin')
  errorUrl.searchParams.set('error', message)
  return NextResponse.redirect(errorUrl)
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const requestedNext = searchParams.get('next')
  const isRecovery = type === 'recovery' || requestedNext === '/auth/update-password'
  const next = getSafeNextPath(requestedNext, isRecovery ? '/auth/update-password' : '/onboarding')

  const providerError = searchParams.get('error_description') ?? searchParams.get('error') ?? searchParams.get('error_code')
  if (providerError) {
    const message = /expired|invalid|already.*used/i.test(providerError)
      ? 'This email link has expired or was already used. Request a new link and try again.'
      : providerError
    return redirectWithError(origin, isRecovery, message)
  }

  try {
    const supabase = await createClient()
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error
      return NextResponse.redirect(new URL(next, origin))
    }

    if (tokenHash && isEmailOtpType(type)) {
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      if (error) throw error
      return NextResponse.redirect(new URL(next, origin))
    }

    return redirectWithError(
      origin,
      isRecovery,
      'The email link did not include a valid sign-in token. Request a new link and try again.',
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    const userMessage = /expired|invalid|already.*used|otp/i.test(message)
      ? 'This email link has expired or was already used. Request a new link and try again.'
      : message || 'We couldn’t verify this email link. Request a new link and try again.'
    return redirectWithError(origin, isRecovery, userMessage)
  }
}
