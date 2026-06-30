'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';
import AuthForm from '@/component/forms/AuthForm';
import Image from 'next/image';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/api/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Моля, проверете имейла си за линк за потвърждение!');
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/api/callback`,
        queryParams: {
          prompt: 'consent',
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-120px)] bg-white flex-row-reverse">
      {/* Right Pane - Image (Reversed for visual balance between Login/Signup) */}
      <div className="hidden lg:block relative w-0 flex-1">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1490750967868-88cb44cb2722?q=80&w=2916&auto=format&fit=crop"
          alt="Beautiful aesthetic notebook and flowers"
          fill
          priority
        />
        <div className="absolute inset-0 bg-green-9/20 backdrop-blur-[2px] mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-9/80 via-green-9/20 to-transparent" />
        
        {/* Brand Text over Image */}
        <div className="absolute bottom-12 left-12 right-12 text-white text-right">
          <h2 className="text-[4rem] font-bold font-montserrat leading-tight">
            Присъединете се към нас
          </h2>
          <p className="mt-4 text-[1.8rem] font-medium text-white/90 max-w-2xl ml-auto">
            Станете част от нашето семейство и създавайте незабравими моменти с уникалните ни продукти.
          </p>
        </div>
      </div>

      {/* Left Pane - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[45%] lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div>
            <h2 className="mt-6 text-[3.2rem] font-bold tracking-tight text-green-dark font-montserrat">
              Създайте профил
            </h2>
            <p className="mt-4 text-[1.6rem] text-gray-600">
              Въведете вашите данни по-долу, за да започнете.
            </p>
          </div>

          <div className="mt-10">
            <AuthForm
              handleEmail={handleEmailSignUp}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              handleGoogle={handleGoogleSignUp}
              message={message}
              isSignUp={true}
            />

            <div className="mt-8 text-center">
              <p className="text-[1.4rem] text-gray-600">
                Вече имате акаунт?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-green-5 hover:text-green-dark transition-colors"
                >
                  Влезте от тук
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
