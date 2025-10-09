# Validation With Zod & React Hook Form

## Ringkasan Perubahan

Implementasi sistem validasi form menggunakan Zod untuk schema validation dan React Hook Form untuk form state management telah berhasil ditambahkan. Sistem ini dilengkapi dengan UI components yang terintegrasi dan form login yang fungsional. Berikut adalah recap perubahan yang telah dilakukan:

## 📦 Dependencies Baru

### Core Form & Validation Libraries

- **`react-hook-form`** v7.64.0 - Form state management dan validation
- **`@hookform/resolvers`** v5.2.2 - Bridge untuk mengintegrasikan schema validation
- **`zod`** v4.1.12 - TypeScript-first schema validation

## 🏗️ Struktur File Baru

### 1. Authentication Layout (`src/app/(auth)/layout.tsx`)

```tsx
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-muted relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute right-4 top-4">
        <DarkModeToggle />
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex items-center justify-center rounded-md bg-teal-500 p-2">
            <Coffee className="size-4" />
          </div>
          Ryan Cafe
        </div>

        {children}
      </div>
    </div>
  );
}
```

**Fitur Layout**:

- **Centered Design**: Full-screen centered layout untuk auth pages
- **Dark Mode Toggle**: Toggle button di pojok kanan atas
- **Brand Logo**: Coffee icon dengan nama "Ryan Cafe"
- **Responsive**: Mobile-first dengan breakpoints
- **Group Layout**: `(auth)` folder untuk grouping tanpa URL path

### 2. Validation Schema (`src/validations/auth-validation.ts`)

```typescript
import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid Email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginForm = z.infer<typeof loginSchema>;
```

**Validation Rules**:

- **Email**: Required field + valid email format
- **Password**: Required field (minimal validation)
- **TypeScript Integration**: Auto-generated types dari schema

### 3. Form Constants (`src/constants/auth-constant.ts`)

```typescript
export const INITIAL_LOGIN_FORM = {
  email: "",
  password: "",
};
```

**Fungsi**: Default values untuk form initialization.

## 🎨 UI Components

### 1. Card Component (`src/components/ui/card.tsx`)

Struktur card component dengan sub-components:

- `Card` - Container utama
- `CardHeader` - Header section dengan grid layout
- `CardTitle` - Title dengan typography
- `CardDescription` - Subtitle dengan muted text
- `CardContent` - Main content area
- `CardAction` - Action buttons area
- `CardFooter` - Footer section

### 2. Form Components (`src/components/ui/form.tsx`)

React Hook Form integration dengan components:

```typescript
const Form = FormProvider; // Root form provider

// Form field dengan context
const FormField = <TFieldValues, TName>({...props}: ControllerProps) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

// Custom hook untuk field state
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState } = useFormContext();
  // ... return field state dan error info
};
```

**Key Components**:

- `FormItem` - Field container dengan unique ID
- `FormLabel` - Label dengan error state styling
- `FormControl` - Input wrapper dengan accessibility
- `FormMessage` - Error message display
- `FormDescription` - Help text

### 3. Input & Label Components

- **Input** (`src/components/ui/input.tsx`): Styled input dengan focus states
- **Label** (`src/components/ui/label.tsx`): Accessible label component

## 📱 Login Implementation

### Login Page (`src/app/(auth)/login/page.tsx`)

```typescript
export const metadata = {
	title: "Ryan Cafe | Login",
};

export default function LoginPage() {
	return <Login />;
}
```

### Login Component (`src/app/(auth)/login/_components/login.tsx`)

```typescript
export default function Login() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    console.log("data", data);
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome</CardTitle>
        <CardDescription>Login to access all features</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field: { ...rest } }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...rest}
                      type="email"
                      placeholder="Insert your email"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field: { ...rest } }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...rest}
                      type="password"
                      placeholder="*******"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button type="submit">Login</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

## 🔄 Form Validation Flow

### 1. Schema Definition dengan Zod

```typescript
// Definisi rules
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Valid email required"),
  password: z.string().min(1, "Password is required"),
});
```

### 2. React Hook Form Setup

```typescript
const form = useForm<LoginForm>({
  resolver: zodResolver(loginSchema), // Zod integration
  defaultValues: INITIAL_LOGIN_FORM, // Default values
});
```

### 3. Form Field Implementation

```typescript
<FormField
  control={form.control}
  name="email"
  render={({ field: { ...rest } }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>      {/* Label dengan accessibility */}
      <FormControl>
        <Input {...rest} />             {/* Input dengan field binding */}
      </FormControl>
      <FormMessage />                   {/* Error message display */}
    </FormItem>
  )}
/>
```

### 4. Form Submission

```typescript
const onSubmit = form.handleSubmit(async (data) => {
  // Data sudah tervalidasi oleh Zod
  console.log("Validated data:", data);
});
```

## 🚀 Usage Examples

### Basic Form Field

```typescript
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Field Label</FormLabel>
      <FormControl>
        <Input {...field} placeholder="Enter value" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## 📁 File Structure

```
src/
├── app/
│   └── (auth)/                      # Auth group layout
│       ├── layout.tsx               # Auth layout
│       └── login/
│           ├── page.tsx             # Login page
│           └── _components/
│               └── login.tsx        # Login form component
├── components/
│   └── ui/
│       ├── card.tsx                 # Card components
│       ├── form.tsx                 # Form components
│       ├── input.tsx                # Input component
│       └── label.tsx                # Label component
├── constants/
│   └── auth-constant.ts             # Form default values
└── validations/
    └── auth-validation.ts           # Zod schemas & types
```
