// src/routes/auth/callback/+server.js
import { redirect } from "@sveltejs/kit"
import { isAuthApiError } from "@supabase/supabase-js"

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get("code")
  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      // If you open in another browser, need to redirect to login.
      // Should not display error
      if (isAuthApiError(error)) {
        redirect(303, "/login/sign_in?verified=true")
      } else {
        throw error
      }
    }
  }

  // Check for redirectTo in the URL
  const redirectTo = url.searchParams.get("redirectTo")
  if (redirectTo) {
    redirect(303, redirectTo)
  }

  // Legacy support for 'next' parameter
  const next = url.searchParams.get("next")
  if (next) {
    redirect(303, next)
  }

  // Default redirect to account
  redirect(303, "/account")
}
