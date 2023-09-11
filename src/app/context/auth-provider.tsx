"use client";

import { createContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const AuthContext = createContext(
  {} as {
    accessToken: string | null;
    supabase: ReturnType<typeof createClientComponentClient>;
  }
);

const AuthProvider = ({
  accessToken,
  children,
}: {
  accessToken: string | null;
  children: React.ReactNode;
}) => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== accessToken) {
        router.refresh();
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [accessToken, supabase, router]);

  return children;
};

export default AuthProvider;
