<script lang="ts">
  import { Auth } from "@supabase/auth-ui-svelte"
  import { sharedAppearance, oauthProviders } from "../login_config"
  import { page } from "$app/stores"

  let { data } = $props()

  // Get the redirectTo parameter from the URL if it exists
  const redirectTo = $page.url.searchParams.get("redirectTo") || "/account"
</script>

<svelte:head>
  <title>Sign up</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Sign Up</h1>
<Auth
  supabaseClient={data.supabase}
  view="sign_up"
  redirectTo={`${data.url}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`}
  showLinks={false}
  providers={oauthProviders}
  socialLayout="horizontal"
  appearance={sharedAppearance}
  additionalData={undefined}
/>
<div class="text-l text-slate-800 mt-4 mb-2">
  Have an account? <a
    class="underline"
    href={"/login/sign_in" +
      ($page.url.searchParams.get("redirectTo")
        ? `?redirectTo=${encodeURIComponent(redirectTo)}`
        : "")}>Sign in</a
  >.
</div>
