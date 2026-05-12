// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   // Your existing authentication / routing logic
//   const currentUser = request.cookies.get('access')?.value;

//   if (request.nextUrl.pathname.startsWith('/login') && currentUser) {
//     return NextResponse.redirect(new URL('/chat', request.url));
//   }

//   return NextResponse.next();
// }

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const currentUser = request.cookies.get("access")?.value;
//   const { pathname } = request.nextUrl;

//   const publicRoutes = ["/login", "/register"];
//   const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));

//   if (isPublicRoute && currentUser) {
//     return NextResponse.redirect(new URL("/home", request.url));
//   }

//   // ✅ redirect logged-out users away from private pages immediately
//   if (!isPublicRoute && !currentUser) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
// };






import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("access")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));

  if (isPublicRoute && currentUser) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isPublicRoute && !currentUser) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|api).*)",
  ],
};
