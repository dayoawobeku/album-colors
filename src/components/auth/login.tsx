"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Login() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [errorMsg, setErrorMsg] = useState("");

  async function logIn(formData: { email: string; password: string }) {
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-10 md:pt-28 mx-auto max-w-[480px] px-4 lg:px-0">
      <h1 className="mt-8 text-md text-center font-medium">
        Log in to your account
      </h1>
      <form
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const formData = {
            email: (
              e.currentTarget.elements.namedItem("email") as HTMLInputElement
            ).value,
            password: (
              e.currentTarget.elements.namedItem("password") as HTMLInputElement
            ).value,
          };
          logIn(formData);
        }}
        className="mt-8 flex flex-col gap-8 w-full"
      >
        <div className="flex flex-col gap-5">
          <label htmlFor="email" className="flex flex-col gap-2">
            Email
            <input
              id="email"
              type="email"
              aria-label="Email"
              required
              data-auth
            />
          </label>
          <label htmlFor="password" className="flex flex-col gap-2 relative">
            Password
            <input
              id="password"
              type="password"
              aria-label="Password"
              required
              data-auth
            />
          </label>
          <Link
            href="forgot-password"
            className="-mt-3 underline text-sm font-medium self-end"
          >
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          className="bg-primary flex items-center justify-center gap-4 text-sm font-bold h-12 rounded transition-all duration-300 outline outline-1 outline-primary hover:outline-primary-900 focus:outline-primary-900 active:bg-primary-900"
        >
          Log in
        </button>
      </form>
      {errorMsg && (
        <p className="text-sm text-danger text-center">{errorMsg}</p>
      )}
      <p className="mt-4 text-semi-sm">
        Don’t have an account?{" "}
        <Link href="/signup" className="font-semibold underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
