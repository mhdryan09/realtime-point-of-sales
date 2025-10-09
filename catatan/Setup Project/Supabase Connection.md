# Supabase Connection

## Ringkasan Perubahan

Implementasi koneksi Supabase telah berhasil ditambahkan ke dalam aplikasi Next.js dengan fitur authentication dan SSR (Server-Side Rendering) support. Berikut adalah recap perubahan yang telah dilakukan:

## 📦 Dependencies Baru

### Core Supabase Packages

- **`@supabase/supabase-js`** v2.50.2 - Client library utama Supabase
- **`@supabase/ssr`** v0.6.1 - Server-Side Rendering support untuk Next.js

### Additional Dependencies (Auto-installed)

- `@supabase/auth-js` v2.70.0 - Authentication functionality
- `@supabase/postgrest-js` v1.19.4 - Database queries
- `@supabase/realtime-js` v2.11.15 - Real-time subscriptions
- `@supabase/storage-js` v2.7.1 - File storage
- `@supabase/functions-js` v2.4.4 - Edge functions
- `@supabase/node-fetch` v2.6.15 - HTTP client
- `cookie` v1.0.2 - Cookie management
- `ws` v8.18.3 - WebSocket support

## 🔧 Konfigurasi Environment

### 1. Environment Variables (`env.example`)

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Penjelasan Variables**:

- `NEXT_PUBLIC_SUPABASE_URL` - URL project Supabase (exposed ke client)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anonymous key untuk public access (exposed ke client)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key untuk admin operations (server-only)

### 2. Environment Config (`src/config/environment.ts`)

```typescript
export const environment = {
	SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
	SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
	SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
};
```

**Fungsi**: Centralized environment variables management dengan fallback ke empty string.

## 🏗️ Supabase Client Implementation

### 1. Browser Client (`src/lib/supabase/client.ts`)

```typescript
import { environment } from "@/config/environment";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
	const { SUPABASE_ANON_KEY, SUPABASE_URL } = environment;

	return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}
```

**Penggunaan**: Client-side operations (React components, browser interactions)
**Features**: Automatic cookie management, real-time subscriptions

### 2. Server Client (`src/lib/supabase/server.ts`)

```typescript
type CreateClientOptions = {
	isAdmin?: boolean;
};

export async function createClient({ isAdmin = false }: CreateClientOptions) {
	const cookieStore = await cookies();
	const { SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } = environment;

	return createServerClient(SUPABASE_URL!, isAdmin ? SUPABASE_SERVICE_ROLE_KEY! : SUPABASE_ANON_KEY!, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
				} catch (error) {
					console.error("Error setting cookies", cookiesToSet);
				}
			},
		},
	});
}
```

**Fitur Penting**:

- **Dual Mode**: Normal user (`isAdmin: false`) vs Admin operations (`isAdmin: true`)
- **Cookie Management**: Automatic session handling dengan Next.js cookies
- **Error Handling**: Try-catch untuk cookie operations

## 🔐 Authentication Middleware

### 1. Middleware Logic (`src/lib/supabase/middleware.ts`)

```typescript
export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request: request });

	const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
				supabaseResponse = NextResponse.next({ request });
				cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
			},
		},
	});

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Authentication Logic
	if (!user && request.nextUrl.pathname !== "/login") {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}

	if (user && request.nextUrl.pathname === "/login") {
		const url = request.nextUrl.clone();
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
```

**Logika Authentication**:

1. **Unauthenticated User**: Redirect ke `/login` (kecuali sudah di `/login`)
2. **Authenticated User**: Redirect ke `/` jika mencoba akses `/login`
3. **Cookie Sync**: Maintain session cookies antara request/response

### 2. Next.js Middleware Setup (`src/middleware.ts`)

```typescript
import { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
	return await updateSession(request);
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

**Matcher Pattern**: Middleware runs pada semua routes KECUALI:

- Static files (`_next/static`)
- Images (`_next/image`, `favicon.ico`)
- Asset files (`.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`)

## 🚀 Cara Penggunaan

### 1. Client-Side Usage

```typescript
// Di React Component
import { createClient } from "@/lib/supabase/client";

function MyComponent() {
	const supabase = createClient();

	// Login
	const handleLogin = async () => {
		await supabase.auth.signInWithPassword({
			email: "user@example.com",
			password: "password",
		});
	};

	// Fetch data
	const { data } = await supabase.from("products").select("*");
}
```

### 2. Server-Side Usage (Server Components)

```typescript
// Di Server Component atau API Route
import { createClient } from "@/lib/supabase/server";

async function ServerComponent() {
	const supabase = await createClient({ isAdmin: false });

	// Get current user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Fetch data with RLS
	const { data } = await supabase.from("products").select("*");
}
```

### 3. Admin Operations

```typescript
// Server-side admin operations
const supabaseAdmin = await createClient({ isAdmin: true });

// Bypass RLS, full database access
const { data } = await supabaseAdmin.from("products").select("*"); // Gets ALL data regardless of RLS
```

## 🔄 Authentication Flow

1. **User Access Protected Route** → Middleware checks session
2. **No Session Found** → Redirect to `/login`
3. **User Login** → Supabase handles authentication
4. **Session Created** → Cookies stored automatically
5. **Access Granted** → User can access protected routes
6. **Session Validation** → Middleware validates on each request

## 🛡️ Security Features

### Row Level Security (RLS)

- **Normal Client**: Respects RLS policies
- **Admin Client**: Bypasses RLS with service role key

### Cookie Security

- **HttpOnly**: Secure session cookies
- **Same-Site**: CSRF protection
- **Secure**: HTTPS only in production

### Environment Variables

- **Client-Safe**: `NEXT_PUBLIC_*` exposed to browser
- **Server-Only**: `SUPABASE_SERVICE_ROLE_KEY` never exposed

## 📁 File Structure

```
src/
├── config/
│   └── environment.ts          # Environment variables config
├── lib/
│   └── supabase/
│       ├── client.ts           # Browser client
│       ├── server.ts           # Server client
│       └── middleware.ts       # Auth middleware logic
└── middleware.ts               # Next.js middleware entry
```

## 💡 Best Practices

1. **Always use Server Client** untuk sensitive operations
2. **Enable RLS** pada semua tables untuk security
3. **Use Admin Client** hanya when necessary (reporting, admin panels)
4. **Handle errors** pada setiap database operation
5. **Implement proper loading states** untuk better UX
