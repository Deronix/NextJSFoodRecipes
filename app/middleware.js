import { NextResponse } from 'next/server';
import { languages, defaultLanguage } from './lib/i18n';

export function middleware(request) {
  // Get pathname (e.g. /about, /recipes)
  const pathname = request.nextUrl.pathname;
  
  // Check if pathname starts with a locale
  const pathnameHasLocale = languages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // If pathname doesn't have locale, redirect to default locale
  if (!pathnameHasLocale) {
    // Exclude specific paths like assets and API routes
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/images/') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }
    
    // Redirect to default locale
    return NextResponse.redirect(
      new URL(
        `/${defaultLanguage}${pathname === '/' ? '' : pathname}`,
        request.url
      )
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};