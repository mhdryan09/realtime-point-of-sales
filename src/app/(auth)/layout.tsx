import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { Coffee } from "lucide-react";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-muted relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute top-4 right-4">
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
