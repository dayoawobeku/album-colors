import {redirect} from 'next/navigation';
import {createServerClient} from '@/helpers/server-client';
import Auth from '@/components/auth';

export default async function SignInPage() {
  const supabase = createServerClient();
  const {data} = await supabase.auth.getSession();

  if (data?.session) {
    redirect('/');
  }

  return <Auth />;
}
