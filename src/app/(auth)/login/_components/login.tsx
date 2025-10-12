"use client";

import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  INITIAL_LOGIN_FORM,
  INITIAL_STATE_LOGIN_FORM,
} from "@/constants/auth-constant";
import { LoginForm, loginSchemaForm } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { login } from "../actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  // define use server action
  const [loginState, loginAction, isPendingLogin] = useActionState(
    login,
    INITIAL_STATE_LOGIN_FORM,
  );

  // useActionState adalah hooks yang memungkinkan kita mengupdate state berdasarkan form action

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      loginAction(formData);
    });
    // stateTransition, fungsi yang menyebabkan state bisa diupdate menggunakan server action
  });

  useEffect(() => {
    if (loginState?.status === "error") {
      toast.error("Login Failed", {
        description: loginState.errors?._form?.[0],
        position: "top-center",
      });
      startTransition(() => {
        loginAction(null);
      });
    } else if (loginState?.status === "success") {
      toast.success("Login Successful", {
        description: "Redirecting to dashboard...",
        position: "top-center",
      });
      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }, [loginState, router]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome</CardTitle>
        <CardDescription>Login to access all features</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
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

            <Button type="submit">
              {isPendingLogin ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
