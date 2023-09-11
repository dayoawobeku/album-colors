import { redirect } from "next/navigation";
import { Signup } from "@/components/auth";
import { createServerClient } from "@/helpers/server-client";

export default async function SignUpPage() {
  const supabase = createServerClient();
  const { data } = await supabase.auth.getSession();

  if (data?.session) {
    redirect("/");
  }

  return <Signup />;
}
