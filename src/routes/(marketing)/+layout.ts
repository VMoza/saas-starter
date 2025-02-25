import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public"
import { createBrowserClient, isBrowser } from "@supabase/ssr"
import type { LayoutLoad } from "./$types"
import type { Database } from "../../DatabaseDefinitions"

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
  depends("supabase:auth")

  const supabase = isBrowser()
    ? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
      })
    : null

  // Get session data if available
  let session = null
  let user = null

  if (data?.session) {
    session = data.session
    user = data.user
  } else if (supabase) {
    // Only call getSession in browser where it's safe
    const { data: sessionData } = await supabase.auth.getSession()
    session = sessionData.session

    if (session) {
      const { data: userData } = await supabase.auth.getUser()
      user = userData.user
    }
  }

  return {
    supabase,
    session,
    user,
  }
} 