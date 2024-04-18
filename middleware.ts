import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export default authMiddleware({
  async afterAuth(auth, req, evt) {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.next();
  },
  // create a publicRoutes regex for /events/:id but not /events/create or /events/:id/update
  // '/events/:id',
  // '/events/:id(\/[^/]+)?',

  publicRoutes: [
    '/',
    '/events/:id',
    '/api/webhooks(.*)',
    '/api/uploadthing',
  ],
  // ignoredRoutes: [
  //   '/api/webhook/clerk',
  //   '/api/webhook/stripe',
  //   '/api/uploadthing'
  // ]
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};