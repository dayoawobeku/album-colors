import {cache} from 'react';
import {cookies} from 'next/headers';
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';

export const createServerClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient({
    cookies: () => cookieStore,
  });
});
