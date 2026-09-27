import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/auth/login", "/auth/register", "/auth/callback"];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isPublicPath = PUBLIC_PATHS.some((path) => 
    path === "/" 
      ? request.nextUrl.pathname === "/" 
      : request.nextUrl.pathname.startsWith(path)
  );
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";

    const fullDest = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    if (fullDest !== "/") {
      url.searchParams.set("redirectTo", fullDest);
    }

    return NextResponse.redirect(url);
  }

  if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/library";
    return NextResponse.redirect(url);
  }

  return supabaseResponse
};