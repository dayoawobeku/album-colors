import { redirect } from "next/navigation";
import ArtistForm from "@/components/form";
import { createServerClient } from "@/helpers/server-client";

export default async function Home() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  return <ArtistForm />;
}
