import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({
  locals: { safeGetSession },
}) => {
  const { session } = await safeGetSession()
  if (!session) {
    redirect(303, "/login")
  }

  // In a real application, you would fetch college data from a database here
  // For now, we'll just return an empty object since the data is hardcoded in the client
  return {}
} 