import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/courses',
  '/courses/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboarding(.*)',
  '/api/webhooks(.*)',
  // Allow Stripe and enrollment related API routes to be reachable from the client
  '/api/stripe(.*)',
  '/api/enroll(.*)',
  '/api/certificates(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    const authObj = await auth()
    if (!authObj.userId) {
      return authObj.redirectToSignIn()
    }
  }
})


export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
