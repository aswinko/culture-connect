"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import ResetForm from "./ResetForm";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

const AuthForm = () => {
  const [mode, setMode] = useState("login");
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "reset"
            ? "Reset Password"
            : mode === "login"
            ? "Login"
            : "Sign up"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "reset"
            ? "Enter your email to reset your password"
            : mode === "login"
            ? "Enter your email and password to login"
            : "Enter your details to create an account"}
        </p>
      </div>
      {mode === "login" && (
        <>
          <LoginForm />
          <div className="text-center flex justify-between">
            <Button
              variant={"link"}
              className="p-0"
              onClick={() => setMode("signup")}
            >
              Need an account? signup
            </Button>
            <Button
              variant={"link"}
              className="p-0"
              onClick={() => setMode("reset")}
            >
              Forgot password?
            </Button>
          </div>
        </>
      )}
      {mode === "signup" && (
        <>
          <SignupForm />
          <div className="text-center flex justify-center">
            <Button
              variant={"link"}
              className="p-0"
              onClick={() => setMode("login")}
            >
              Already have an account? Login
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center px-8">
            By clicking the sign up button, you agree to our{" "}
            <Link
              className="underline underline-offset-4 hover:text-primary"
              href="#"
            >
              terms and services
            </Link>{" "}
            and{" "}
            <Link
              className="underline underline-offset-4 hover:text-primary"
              href="#"
            >
              privacy policy.
            </Link>
          </p>
        </>
      )}
      {mode === "reset" && (
        <>
          <ResetForm />
          <div className="text-center">
            <Button
              variant={"link"}
              className="p-0"
              onClick={() => setMode("login")}
            >
              Back to login
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthForm;