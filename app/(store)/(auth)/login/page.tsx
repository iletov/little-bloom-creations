'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';
import AuthForm from '@/component/forms/AuthForm';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const router = useRouter();
  const supabase = createClient();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/api/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-120px)] flex items-center justify-center bg-pink-1/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[20%] w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-[2.8rem] font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <AuthForm
          handleEmail={handleEmailSignIn}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          handleGoogle={handleGoogleSignIn}
          message={message}
        />
        <div className="text-center text-[1.2rem]">
          <Link
            href="/signup"
            className="text-indigo-600 hover:text-indigo-500">
            Dont have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
