# Login Action

## Recap Perubahan

### 1. Login Actions (`src/app/(auth)/login/actions.ts`)

**Perubahan:** Menambahkan file baru untuk Server Actions login

#### **Penjelasan Server Actions:**

Server Actions adalah fitur Next.js yang memungkinkan kita menjalankan kode di server langsung dari client component. Seperti fungsi backend yang bisa dipanggil dari frontend.

**Keuntungan Server Actions:**

- **Keamanan**: Kode berjalan di server, API key aman
- **Performance**: Tidak perlu membuat API route terpisah
- **Type Safety**: TypeScript support penuh
- **Real-time**: Bisa update UI langsung

#### **Detail Script Actions:**

```javascript
"use server"; // Directive yang menandakan ini adalah server action
```

**Fungsi Login:**

```javascript
export async function login(
  prevState: AuthFormState,  // State sebelumnya dari useActionState
  formData: FormData | null, // Data form yang dikirim dari client
)
```

**Flow Login:**

1. **Validasi Input**: Menggunakan Zod schema untuk validasi
2. **Supabase Auth**: Login menggunakan `signInWithPassword`
3. **Ambil Profile**: Query tabel profiles berdasarkan user ID
4. **Set Cookie**: Simpan data profile ke cookie untuk session
5. **Redirect**: Arahkan ke halaman home setelah berhasil login

**Supabase Integration:**

```javascript
// Membuat koneksi Supabase
const supabase = await createClient();

// Login dengan email & password
const {
  error,
  data: { user },
} = await supabase.auth.signInWithPassword(validatedFields.data);

// Query tabel profiles
const { data: profile } = await supabase
  .from("profiles") // nama tabel
  .select("*") // ambil semua field
  .eq("id", user?.id) // where id = user.id
  .single(); // return object (bukan array)
```

### 2. Login Component (`src/app/(auth)/login/_components/login.tsx`)

**Perubahan:** Mengintegrasikan Server Actions dengan useActionState

#### **Penjelasan useActionState:**

Hook baru di React untuk mengelola state dari Server Actions. Menggabungkan useReducer + Server Actions.

```javascript
const [loginState, loginAction, isPendingLogin] = useActionState(
  login, // server action function
  INITIAL_STATE_LOGIN_FORM, // initial state
);
```

**Return Values:**

- **loginState**: State terkini (status, errors)
- **loginAction**: Function untuk trigger server action
- **isPendingLogin**: Boolean loading state

#### **startTransition:**

```javascript
startTransition(() => {
  loginAction(formData);
});
```

**Penjelasan:**

- **startTransition**: React hook untuk non-blocking updates
- Memungkinkan UI tetap responsive saat server action berjalan
- Mengupdate state tanpa freeze interface

#### **FormData Conversion:**

```javascript
const formData = new FormData();
Object.entries(data).forEach(([key, value]) => {
  formData.append(key, value);
});
```

**Penjelasan:**

- Mengkonversi object form data ke FormData format
- FormData diperlukan untuk Server Actions
- Server Actions hanya menerima FormData atau primitives

#### **Error Handling:**

```javascript
useEffect(() => {
  if (loginState?.status === "error") {
    startTransition(() => {
      loginAction(null); // Reset state
    });
  }
}, [loginState]);
```

**Loading State UI:**

```javascript
<Button type="submit">
  {isPendingLogin ? <Loader2 className="animate-spin" /> : "Login"}
</Button>
```

### 3. Supabase Server Client (`src/lib/supabase/server.ts`)

**Perubahan:** Update konfigurasi server client

#### **Penjelasan Supabase SSR:**

Supabase SSR (Server-Side Rendering) package untuk Next.js yang handle cookies dan authentication state.

**Key Features:**

- **Cookie Management**: Otomatis handle auth cookies
- **isAdmin**: Opsi untuk menggunakan service role key
- **Type Safety**: Full TypeScript support

```javascript
export async function createClient({
  isAdmin = false,
}: CreateClientOptions = {}) {
```

**Admin Mode:**

- `isAdmin = true`: Menggunakan SUPABASE_SERVICE_ROLE_KEY (bypass RLS)
- `isAdmin = false`: Menggunakan SUPABASE_ANON_KEY (normal user)

**Cookie Integration:**

```javascript
cookies: {
  getAll() {
    return cookieStore.getAll(); // Baca semua cookies
  },
  setAll(cookiesToSet) {
    // Set multiple cookies sekaligus
    cookiesToSet.forEach(({ name, value, options }) =>
      cookieStore.set(name, value, options),
    );
  },
}
```

### 4. Constants & Types

**Auth Constants (`src/constants/auth-constant.ts`):**

```javascript
export const INITIAL_STATE_LOGIN_FORM = {
  status: "idle",
  errors: {
    email: [],
    password: [],
    _form: [], // untuk error general
  },
};
```

**Auth Types (`src/types/auth.d.ts`):**

```javascript
export type AuthFormState = {
  status?: string;
  errors: {
    email?: string[];
    password?: string[];
    _form?: string[]; // error umum dari server
  };
};
```

### 5. Validation Schema Update

**Schema Name Change:**

```javascript
// Sebelum
export const loginSchema = z.object({...});

// Sesudah
export const loginSchemaForm = z.object({...});
```

**Alasan perubahan:**

- Konsistensi naming convention
- Membedakan schema untuk form vs API

---

## **Flow Lengkap Login System:**

1. **User input** → Form validation (Zod)
2. **Form submit** → Convert to FormData
3. **startTransition** → Trigger server action
4. **Server action** → Validate + Supabase auth
5. **Success** → Set cookie + redirect
6. **Error** → Return error state
7. **UI update** → Show loading/error state

## **Keuntungan Arsitektur Ini:**

1. **Type Safe**: End-to-end TypeScript
2. **Secure**: Server-side authentication
3. **Performance**: No additional API calls
4. **User Experience**: Real-time loading states
5. **Maintainable**: Clean separation of concerns

_Catatan: Sistem ini menggunakan modern Next.js patterns dengan Server Actions dan Supabase untuk authentication yang aman dan performant._
