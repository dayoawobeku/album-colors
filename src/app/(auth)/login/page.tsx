import { redirect } from "next/navigation";
import { Login } from "@/components/auth";
import { createServerClient } from "@/helpers/server-client";

export default async function SignInPage() {
  const supabase = createServerClient();
  const { data } = await supabase.auth.getSession();

  if (data?.session) {
    redirect("/");
  }

  return <Login />;
}
