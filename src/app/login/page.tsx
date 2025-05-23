import { GalleryVerticalEnd, Music } from "lucide-react";
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
            <div className="flex h-6 w-6 items-center justify-center rounded-md text-purple-700">
              <Music className="size-6" />
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
          fill
          src="/auth.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
