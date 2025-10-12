# Toaster Notification

## Recap Perubahan

### 1. Install Package Sonner

**Langkah:**
Menjalankan perintah berikut di terminal untuk menambah library toast notification:

```bash
npx shadcn@latest add sonner
```

**Penjelasan:**

- **Sonner**: Library toast notification yang ringan dan modern untuk React
- **ShadCN Integration**: Otomatis menginstall package dan membuat component wrapper
- **Theme Support**: Built-in support untuk dark/light mode

### 2. Integrasi Toaster di Root Layout

**Langkah:**
Import dan tambahkan `<Toaster />` ke dalam file `src/app/layout.tsx`:

```typescript
import { Toaster } from "sonner";

// Di dalam JSX:
<ThemeProvider>
  {children}
  <Toaster />
</ThemeProvider>
```

**Penjelasan:**

- **Global Mount**: Toaster di-mount di root level agar bisa dipanggil dari mana saja
- **Theme Provider Integration**: Ditempatkan dalam ThemeProvider untuk akses theme
- **Single Instance**: Hanya satu instance Toaster di seluruh aplikasi

### 3. Integrasi Toast di Login Component

**Langkah:**
Import fungsi `toast` dari Sonner dan `useRouter` dari Next.js di file `src/app/(auth)/login/_components/login.tsx`:

```typescript
import { toast } from "sonner";
import { useRouter } from "next/navigation";
```

Kemudian tambahkan useEffect untuk menangani notifikasi:

```typescript
useEffect(() => {
  if (loginState?.status === "error") {
    toast.error("Login Failed", {
      description: loginState.errors?._form?.[0],
      position: "top-center",
    });
  } else if (loginState?.status === "success") {
    toast.success("Login Successful", {
      description: "Redirecting to dashboard...",
      position: "top-center",
    });
    setTimeout(() => {
      router.push("/");
    }, 1000);
  }
}, [loginState, router]);
```

**Penjelasan:**

- **Error Toast**: Menampilkan pesan error dari server action
- **Success Toast**: Menampilkan pesan sukses login
- **Auto Redirect**: Redirect otomatis setelah 1 detik login sukses

### 4. Update Login Actions

**Langkah:**
Mengubah server action di file `src/app/(auth)/login/actions.ts` dari server-side redirect menjadi return status:

**Sebelum:**

```typescript
revalidatePath("/", "layout");
redirect("/");
```

**Sesudah:**

```typescript
revalidatePath("/", "layout");

return {
  status: "success",
  errors: {
    email: [],
    password: [],
    _form: [],
  },
};
```

**Alasan Perubahan:**

- **Client-Side Redirect**: Redirect ditangani di client dengan router.push()
- **Toast Display**: Memberi waktu untuk menampilkan success toast
- **User Experience**: Feedback visual sebelum redirect

---

**Kesimpulan:**
Perubahan ini menambahkan fitur notifikasi toast yang terintegrasi dengan theme aplikasi, memberikan feedback visual yang jelas kepada user saat login, dan meningkatkan user experience secara keseluruhan.

### **Toast Types yang Tersedia:**

- `toast.success()`: Notification sukses (hijau)
- `toast.error()`: Notification error (merah)
- `toast.info()`: Notification informasi (biru)
- `toast.warning()`: Notification peringatan (kuning)
- `toast.loading()`: Loading state notification

---

_Catatan: Sonner adalah library toast modern yang memberikan experience yang smooth dan terintegrasi dengan baik dalam ekosistem React/Next.js._
