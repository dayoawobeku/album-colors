'use client';

import {useRouter} from 'next/navigation';
import {createClientComponentClient} from '@supabase/auth-helpers-nextjs';

export default function Logout() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const logOut = () => {
    supabase.auth.signOut();
    router.refresh();
  };
  return (
    <button
      className="mt-10 text-red-700 font-medium w-full flex items-center justify-center gap-4 text-sm h-12"
      onClick={logOut}
    >
      Logout
    </button>
  );
}
