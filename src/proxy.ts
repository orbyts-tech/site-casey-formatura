import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  DEVELOPMENT_ADMIN_COOKIE,
  readDevelopmentAdminSessionEmail,
} from "@/features/admin/infrastructure/development-admin-session-token";
import {
  getDevelopmentAdminCredentials,
  getSupabaseAuthCredentials,
  isAllowedAdminEmail,
  type SupabaseAuthCredentials,
} from "@/infrastructure/server-config";
import { ADMIN_ROUTES } from "@/lib/routes";

interface OptimisticAdminSession {
  readonly isSignedIn: boolean;
  readonly response: NextResponse;
}

async function readSupabaseSession(
  request: NextRequest,
  credentials: SupabaseAuthCredentials,
): Promise<OptimisticAdminSession> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(credentials.url, credentials.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([headerName, headerValue]) => response.headers.set(headerName, headerValue));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const email = data?.claims.email;
  return { isSignedIn: typeof email === "string" && isAllowedAdminEmail(email), response };
}

function readDevelopmentSession(request: NextRequest, sessionSecret: string): OptimisticAdminSession {
  const email = readDevelopmentAdminSessionEmail(request.cookies.get(DEVELOPMENT_ADMIN_COOKIE)?.value, sessionSecret);
  return { isSignedIn: email !== null && isAllowedAdminEmail(email), response: NextResponse.next({ request }) };
}

async function readAdminSession(request: NextRequest): Promise<OptimisticAdminSession> {
  const supabaseCredentials = getSupabaseAuthCredentials();
  if (supabaseCredentials) return readSupabaseSession(request, supabaseCredentials);

  const developmentCredentials = getDevelopmentAdminCredentials();
  if (developmentCredentials) return readDevelopmentSession(request, developmentCredentials.sessionSecret);

  return { isSignedIn: false, response: NextResponse.next({ request }) };
}

function redirectPreservingCookies(request: NextRequest, pathname: string, sourceResponse: NextResponse): NextResponse {
  const redirectResponse = NextResponse.redirect(new URL(pathname, request.nextUrl));
  sourceResponse.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
  return redirectResponse;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { isSignedIn, response } = await readAdminSession(request);
  const isSignInPage = request.nextUrl.pathname === ADMIN_ROUTES.signIn;

  if (isSignInPage && isSignedIn) return redirectPreservingCookies(request, ADMIN_ROUTES.overview, response);
  if (!isSignInPage && !isSignedIn) return redirectPreservingCookies(request, ADMIN_ROUTES.signIn, response);

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
