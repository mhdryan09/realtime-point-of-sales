# Darkmode System

## Ringkasan Perubahan

Implementasi sistem dark mode telah berhasil ditambahkan ke dalam aplikasi Next.js menggunakan `next-themes` dan Radix UI. Berikut adalah recap perubahan yang telah dilakukan:

## 📦 Dependencies Baru

### Package Dependencies

- **`@radix-ui/react-dropdown-menu`** v2.1.16 - Komponen dropdown menu untuk toggle theme
- **`next-themes`** v0.4.6 - Library untuk mengelola theme system (light/dark/system)

### Additional Dependencies (Auto-installed)

- `@floating-ui/core`, `@floating-ui/dom`, `@floating-ui/react-dom` - Untuk positioning dropdown menu
- `aria-hidden`, `react-remove-scroll`, `use-callback-ref`, dll. - Dependencies untuk accessibility dan interactivity

## 🏗️ Struktur File Baru

### 1. Theme Provider (`src/providers/theme-provider.tsx`)

```tsx
"use client";

import { ThemeProvider as NextThemeProvider, ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
```

**Fungsi**: Wrapper untuk NextThemeProvider yang akan mengatur context theme di seluruh aplikasi.

### 2. Dark Mode Toggle Component (`src/components/common/darkmode-toggle.tsx`)

```tsx
export function DarkModeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="..." />
					<Moon className="..." />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
```

**Fitur Utama**:

- **Icon Animation**: Sun dan Moon icon dengan smooth transition menggunakan CSS classes
- **Three Theme Options**: Light, Dark, dan System (mengikuti OS preference)
- **Dropdown Menu**: Clean UI dengan Radix UI dropdown

### 3. Dropdown Menu UI Component (`src/components/ui/dropdown-menu.tsx`)

File ini berisi semua komponen Radix UI dropdown menu yang sudah di-style dengan Tailwind CSS untuk konsistensi design system.

## 🔧 Perubahan Konfigurasi

### 1. Root Layout (`src/app/layout.tsx`)

**Perubahan Penting**:

```tsx
// Tambahan import
import { ThemeProvider } from "@/providers/theme-provider";

// HTML dengan suppressHydrationWarning
<html lang="en" suppressHydrationWarning>
	<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
			{children}
		</ThemeProvider>
	</body>
</html>;
```

**Penjelasan Properties**:

- `attribute="class"` - Theme akan diterapkan via CSS class (dark/light)
- `defaultTheme="system"` - Default mengikuti sistem operasi
- `enableSystem` - Memungkinkan deteksi system preference
- `disableTransitionOnChange` - Menghindari flicker saat ganti theme
- `suppressHydrationWarning` - Mencegah warning hydration karena perbedaan server/client theme

### 2. Page Implementation (`src/app/page.tsx`)

```tsx
import { DarkModeToggle } from "@/components/common/darkmode-toggle";

export default function Home() {
	return (
		<div>
			<Button className="bg-red-400 dark:bg-amber-300">Hello</Button>
			<DarkModeToggle />
		</div>
	);
}
```

**Testing Element**: Button dengan conditional styling (`dark:bg-amber-300`) untuk testing theme functionality.

### 3. TypeScript Configuration

- **`src/global.d.ts`** - Menambahkan type declaration untuk CSS modules
- **`tsconfig.json`** - Include path untuk global.d.ts

## 🔄 Cara Kerja System

1. **ThemeProvider** wrap seluruh aplikasi dan menyediakan context theme
2. **useTheme hook** dari next-themes memberikan akses ke `setTheme` function
3. **Toggle Component** menggunakan dropdown untuk memilih theme (light/dark/system)
4. **CSS Classes** `dark:` akan aktif/non-aktif berdasarkan theme yang dipilih
5. **Local Storage** menyimpan preference user secara otomatis

## 📱 Fitur yang Tersedia

- ✅ **Light Mode** - Theme terang
- ✅ **Dark Mode** - Theme gelap
- ✅ **System Mode** - Mengikuti OS preference
- ✅ **Smooth Transition** - Animasi icon yang halus
- ✅ **Persistent** - Menyimpan pilihan user
- ✅ **Responsive** - Dropdown menu responsive
- ✅ **Accessibility** - Support screen reader dengan `sr-only` labels
