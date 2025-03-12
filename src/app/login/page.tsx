import { GalleryVerticalEnd } from "lucide-react";
import AuthForm from "@/components/Authentication/AuthForm";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

export default async function LoginPage() {

  // if user is logged in redirect to home page
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (!error || data?.user) {
    redirect("/");
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Culture Connect.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* <LoginForm /> */}
            <AuthForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          width="100"
          height="100"
          src="/next.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-contain p-4 dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
