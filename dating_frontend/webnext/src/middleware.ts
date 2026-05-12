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

//   if (!isPublicRoute && !currentUser) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|_next/data|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|api).*)",
//   ],
// };




import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const loggedIn = request.cookies.get("logged_in")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));

  if (isPublicRoute && loggedIn === "true") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isPublicRoute && loggedIn !== "true") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|api).*)",
  ],
};