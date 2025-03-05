import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="48px"
            height="48px"
          >
            <path
              fill="#4285F4"
              d="M24 9.5c3.6 0 6.4 1.6 8.1 2.9l6-5.7C34.8 3.3 29.7 1 24 1 14.6 1 6.9 6.1 3.2 14.2l7.2 5.6c1.7-5 6.2-10.3 13.6-10.3z"
            />
            <path
              fill="#34A853"
              d="M46.1 24.5c0-1.8-.2-3.6-.6-5.3H24v10h12.8c-.7 3.7-2.6 6.8-5.7 9l7.2 5.6c4.9-4.6 7.8-11.5 7.8-19.3z"
            />
            <path
              fill="#FBBC05"
              d="M10.4 28.3c-0.5-1.6-0.8-3.3-0.8-5.1s0.3-3.5 0.8-5.1l-7.2-5.6C2.1 16 1 19.8 1 23.2s1.1 7.2 3.2 10.7l7.2-5.6z"
            />
            <path
              fill="#EA4335"
              d="M24 47c6.5 0 12.1-2.2 16.1-6l-7.2-5.6c-2.3 1.6-5.3 2.5-8.9 2.5-7.4 0-11.9-5.3-13.6-10.3l-7.2 5.6C6.9 41.9 14.6 47 24 47z"
            />
          </svg>
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
