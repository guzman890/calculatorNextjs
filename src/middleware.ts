import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const user = cookies().get('session')?.value;
  console.log("user ->", user);

  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/') {
    if (user) {
      return NextResponse.redirect(new URL("/operations", request.url));
    } 
  } else {
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/operations'],
};