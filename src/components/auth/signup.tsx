"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Signup() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function signUp(formData: { email: string; password: string }) {
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg(
        "Success! Please check your email for further instructions."
      );
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-10 md:pt-28 mx-auto max-w-[480px] px-4 lg:px-0">
      <h1 className="mt-8 text-md text-center font-medium">
        Create a free account
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = {
            email: (
              e.currentTarget.elements.namedItem("email") as HTMLInputElement
            ).value,
            password: (
              e.currentTarget.elements.namedItem("password") as HTMLInputElement
            ).value,
          };
          signUp(formData);
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
        </div>
        <button
          type="submit"
          className="bg-primary flex items-center justify-center gap-4 text-sm font-bold h-12 rounded transition-all duration-300 outline outline-1 outline-primary hover:outline-primary-900 focus:outline-primary-900 active:bg-primary-900"
        >
          Sign up
        </button>
      </form>
      {errorMsg && <div className="text-danger">{errorMsg}</div>}
      {successMsg && <div className="text-black">{successMsg}</div>}
      <p className="mt-4 text-semi-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
