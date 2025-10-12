"use server";

import { INITIAL_STATE_LOGIN_FORM } from "@/constants/auth-constant";
import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth";
import { loginSchemaForm } from "@/validations/auth-validation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  prevState: AuthFormState,
  formData: FormData | null,
) {
  if (!formData) {
    return INITIAL_STATE_LOGIN_FORM;
  }

  // validasi inputan form login
  const validatedFields = loginSchemaForm.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // jika error
  if (!validatedFields.success) {
    return {
      status: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // jika lolos (tdk ada error)
  // define supabase
  const supabase = await createClient();

  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword(validatedFields.data);

  // jika ada error dari supabase
  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors, // error sebelumnya
        _form: [error.message],
      },
    };
  }

  // ambil data dari table profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id) // cari berdasarkan id
    .single(); // bentuk berupa object bkn array

  // jika ada profile nya, masukan ke cookie
  if (profile) {
    const cookieStore = await cookies();
    cookieStore.set("user_profile", JSON.stringify(profile), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 tahun
    });
  }

  revalidatePath("/", "layout");
  redirect("/");
}
