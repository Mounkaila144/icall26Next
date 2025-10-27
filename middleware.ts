import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Log pour debugging
  console.log('Middleware - URL:', url.pathname);
  console.log('Middleware - Host:', hostname);

  // Si c'est une requête API, on la laisse passer sans modification
  if (url.pathname.startsWith('/api/')) {
    console.log('Middleware - API request, passing through');
    return NextResponse.next();
  }

  // Si c'est une requête _next (assets, etc.), on la laisse passer
  if (url.pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // Pour les autres routes, on continue normalement
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
