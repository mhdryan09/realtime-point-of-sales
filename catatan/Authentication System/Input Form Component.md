# Input Form Component

## Recap Perubahan

### 1. FormInput Component (`src/components/common/form-input.tsx`)

**Perubahan:** Menambahkan komentar penjelasan lengkap di bawah script

**Detail Script:**

- **Generic Type**: `<T extends FieldValues>` membuat component type-safe dan fleksibel
- **Props Interface**:
  - `form`: Object dari useForm() untuk kontrol form
  - `name`: Nama field yang harus sesuai struktur data
  - `label`: Text label yang ditampilkan
  - `placeholder`: Text hint (opsional)
  - `type`: Jenis input dengan default "text"

**Logika Utama:**

```tsx
{
  type === "textarea" ? (
    <Textarea
      {...rest}
      placeholder={placeholder}
      autoComplete="off"
      className="resize-none"
    />
  ) : (
    <Input {...rest} type={type} placeholder={placeholder} autoComplete="off" />
  );
}
```

**Fitur Keamanan:**

- `autoComplete="off"`: Mencegah browser menyimpan data otomatis
- `resize-none`: User tidak bisa resize textarea
- `{...rest}`: Menyebarkan props dari React Hook Form (value, onChange, onBlur)

**Struktur Component:**

- `FormField`: Wrapper utama yang menghubungkan dengan React Hook Form
- `FormItem`: Container untuk satu field input
- `FormLabel`: Label di atas input
- `FormControl`: Wrapper untuk input element
- `FormMessage`: Menampilkan pesan error otomatis

### 2. Login Component (`src/app/(auth)/login/_components/login.tsx`)

**Implementasi FormInput:**

```tsx
<FormInput
  form={form}
  name="email"
  label="Email"
  placeholder="Insert Email here"
  type="email"
/>

<FormInput
  form={form}
  name="password"
  label="Password"
  placeholder="********"
  type="password"
/>
```

**Setup Form:**

- Menggunakan `useForm<LoginForm>` dengan zodResolver untuk validasi
- `defaultValues` dari `INITIAL_LOGIN_FORM` constant
- `onSubmit` handler yang menerima data tervalidasi

**Keuntungan yang Didapat:**

1. **Konsistensi**: Semua input memiliki styling dan behavior yang sama
2. **Type Safety**: TypeScript memastikan nama field sesuai struktur LoginForm
3. **DRY Principle**: Tidak perlu menulis struktur form berulang-ulang
4. **Error Handling**: Otomatis menampilkan pesan error dari validasi Zod
5. **Maintainability**: Perubahan styling cukup dilakukan di satu tempat

**Import Dependencies:**

- React Hook Form untuk form management
- Zod untuk schema validation
- ShadCN UI components untuk styling
- Custom FormInput component yang telah dibuat

---

_Catatan: Component FormInput ini adalah reusable component yang bisa digunakan di berbagai form lain dalam aplikasi dengan cara yang sama._
