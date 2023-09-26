import {redirect} from 'next/navigation';
import ArtistForm from '@/components/form';
import {createServerClient} from '@/helpers/server-client';
import ArtistesAdded from '@/components/artistes-added';
import Logout from '@/components/logout';

export const revalidate = 0;

export default async function Home() {
  const supabase = createServerClient();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  const {data} = await supabase
    .from('artistes')
    .select('*')
    .order('created_at', {ascending: false});

  return (
    <main className="flex flex-col items-center justify-center max-w-sm mx-auto">
      <ArtistForm />

      <section className="mt-10 w-full">
        <h3 className="text-xl text-grey font-bold">
          Artistes in the database:
        </h3>

        <ArtistesAdded data={data || []} />
      </section>

      <Logout />
    </main>
  );
}
