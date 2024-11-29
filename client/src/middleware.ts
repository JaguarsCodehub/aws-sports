import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import routes from './lib/routes';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const isAdminAuthPage = request.nextUrl.pathname === '/admin/login';
    const isAdminEventsPage = request.nextUrl.pathname === '/admin/events';
    const isAdminCreateEventsPage = request.nextUrl.pathname === '/admin/create-events';
    const isAdminRegistrationsPage = request.nextUrl.pathname === '/admin/registrations';
    // Allow access to admin login and events pages
    if (isAdminAuthPage || isAdminEventsPage || isAdminCreateEventsPage || isAdminRegistrationsPage) {
        return NextResponse.next();
    }

    // Protect other admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL(routes.auth.adminLogin, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
};