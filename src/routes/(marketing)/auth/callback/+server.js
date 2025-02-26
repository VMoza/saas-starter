// src/routes/auth/callback/+server.js
import { redirect } from "@sveltejs/kit"
import { isAuthApiError } from "@supabase/supabase-js"

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get("code")
  
  // Log the callback URL for debugging
  console.log("Auth callback URL:", url.toString())
  
  if (code) {
    try {
      console.log("Exchanging code for session...")
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error("Error exchanging code for session:", error)
        // If there's an error, redirect to login
        redirect(303, "/login/sign_in?error=session_exchange")
      }
      
      console.log("Session exchange successful")
    } catch (error) {
      console.error("Exception in exchangeCodeForSession:", error)
      // If you open in another browser, need to redirect to login.
      // Should not display error
      if (isAuthApiError(error)) {
        redirect(303, "/login/sign_in?verified=true")
      } else {
        console.error("Unexpected error in auth callback:", error)
        redirect(303, "/login/sign_in?error=unexpected")
      }
    }
  } else {
    console.log("No code parameter in auth callback URL")
  }

  // Check for redirectTo in the URL
  const redirectTo = url.searchParams.get("redirectTo")
  if (redirectTo) {
    console.log("Redirecting to:", redirectTo)
    redirect(303, redirectTo)
  }

  // Legacy support for 'next' parameter
  const next = url.searchParams.get("next")
  if (next) {
    console.log("Redirecting to next:", next)
    redirect(303, next)
  }

  // Default redirect to account
  console.log("Default redirect to /account")
  redirect(303, "/account")
}
