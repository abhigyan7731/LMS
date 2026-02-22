import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export async function getSupabaseWithAuth() {
  const supabase = await createClient()
  const { userId } = await auth()

  if (userId) {
    // auth().getToken is used previously to get a Supabase template token; attempt to call if available
    try {
      const token = (await auth()).getToken ? (await auth()).getToken({ template: 'supabase' }) : null
      if (token) {
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: '',
        })
      }
    } catch (err) {
      // ignore if not available
    }
  }

  return supabase
}
