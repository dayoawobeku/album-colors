'use client';

import {FormEvent, useState} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {createClientComponentClient} from '@supabase/auth-helpers-nextjs';

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return `${url}/api/auth/callback`;
};

export default function Auth() {
  const supabase = createClientComponentClient();

  async function logInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getURL(),
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-10 md:pt-28 mx-auto max-w-[480px] px-4 lg:px-0 text-grey">
      <h1 className="mt-8 text-4xl text-center font-bold">
        album colors admin
      </h1>
      <button
        onClick={logInWithGoogle}
        className="mt-10 w-full bg-gray-50 flex items-center justify-center gap-4 text-sm font-bold h-12 rounded transition-all duration-300 outline outline-1 outline-gray-300 hover:outline-gray-400 focus:outline-gray-400 active:bg-gray-100"
      >
        <Image alt="google logo" src="/google.svg" width={24} height={24} />
        <span>Continue with Google</span>
      </button>
    </div>
  );
}
