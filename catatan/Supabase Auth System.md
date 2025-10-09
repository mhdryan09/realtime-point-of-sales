# Supabase Auth System

## Recap Perubahan

### 1. Migration File: Auth Profiles (`src/migrations/001-auth-profiles.sql`)

**Perubahan:** Menambahkan file migration SQL untuk setup sistem autentikasi dengan tabel profiles

### Detail Script Migration:

#### **1. Tabel Profiles**

```sql
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  name text,
  role text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);
```

**Penjelasan:**

- **id**: Primary key yang reference ke `auth.users` (tabel bawaan Supabase)
- **name**: Nama pengguna (text)
- **role**: Peran pengguna dalam sistem (text)
- **avatar_url**: URL foto profil pengguna (text)
- **created_at**: Waktu pembuatan record dengan timezone UTC
- **updated_at**: Waktu update terakhir dengan timezone UTC
- **on delete cascade**: Jika user di `auth.users` dihapus, data di `profiles` juga ikut terhapus

#### **2. Row Level Security (RLS)**

```sql
alter table public.profiles enable row level security;
```

**Penjelasan:**

- Mengaktifkan Row Level Security untuk tabel profiles
- Memastikan user hanya bisa akses data mereka sendiri
- Mencegah akses data user lain tanpa izin

#### **3. Function Handle New User**

```sql
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, role, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'role', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$;
```

**Penjelasan:**

- **Trigger Function**: Otomatis dijalankan saat user baru dibuat
- **raw_user_meta_data**: Mengambil data metadata dari user saat registrasi
- **JSON Operator (->>, ->)**: Ekstrak data JSON dari metadata
- **security definer**: Function dijalankan dengan hak akses pembuat function
- **Tujuan**: Otomatis membuat record di tabel profiles saat user register

#### **4. Trigger On User Created**

```sql
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

**Penjelasan:**

- **after insert**: Trigger dijalankan setelah user baru ditambahkan
- **for each row**: Dijalankan untuk setiap user yang dibuat
- **Tujuan**: Menghubungkan pembuatan user dengan pembuatan profile

#### **5. Function Handle Delete User**

```sql
create function public.handle_delete_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
 delete from public.profiles where id = old.id;
 return old;
end;
$$;
```

**Penjelasan:**

- **old.id**: Reference ke user yang akan dihapus
- **Tujuan**: Membersihkan data profile saat user dihapus
- **Backup Delete**: Meskipun sudah ada CASCADE, ini sebagai backup

#### **6. Trigger On User Deleted**

```sql
create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute procedure public.handle_delete_user()
```

**Penjelasan:**

- **after delete**: Trigger dijalankan setelah user dihapus
- **Tujuan**: Memastikan tidak ada data orphan di tabel profiles

### **Keuntungan Sistem Auth Ini:**

1. **Sinkronisasi Otomatis**: Profile dibuat/dihapus otomatis saat user register/delete
2. **Data Consistency**: Memastikan setiap user memiliki profile
3. **Security**: RLS memproteksi data user
4. **Scalable**: Menggunakan trigger untuk automasi
5. **Clean Architecture**: Memisahkan data auth dan profile user

### **Flow Sistem:**

1. User register → Auth.users dibuat → Trigger → Profile dibuat otomatis
2. User login → Akses data profile berdasarkan id user
3. User delete → Auth.users dihapus → Trigger → Profile ikut terhapus

---

_Catatan: Migration ini adalah fondasi sistem autentikasi yang memungkinkan penyimpanan data tambahan user seperti nama, role, dan avatar._
