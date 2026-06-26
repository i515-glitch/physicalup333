// Disable authentication for admin page (no password required)
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Always allow access
  return NextResponse.next();
}

export const config = {
  matcher: '/admin.html',
};
