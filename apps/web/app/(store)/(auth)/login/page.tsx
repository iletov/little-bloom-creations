'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';
import AuthForm from '@/component/forms/AuthForm';
import Image from 'next/image';

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
    <div className="flex min-h-[calc(100dvh-80px)] bg-white">
      {/* Left Pane - Image */}
      <div className="hidden lg:block relative w-auto flex-1">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?q=80&w=2787&auto=format&fit=crop"
          alt="Beautiful floral arrangement"
          fill
          priority
        />
        <div className="absolute inset-0 bg-green-9/20 backdrop-blur-[2px] mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-9/80 via-green-9/40 to-transparent" />
        
        {/* Brand Text over Image */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-[4rem] font-bold font-montserrat leading-tight">
            Little Bloom Creations
          </h2>
          <p className="mt-4 text-[1.8rem] font-medium text-white/90 max-w-2xl">
            Ръчно изработени красоти, създадени с любов и внимание към всеки детайл. Влезте, за да продължите вашето пазаруване.
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 ">
        <div className="mx-auto w-full max-w-2xl">
          <div>
            <h2 className="mt-6 text-[3.2rem] font-bold tracking-tight text-green-dark font-montserrat">
              Влезте във вашия профил
            </h2>
            <p className="mt-4 text-[1.6rem] text-gray-600">
              Добре дошли отново! Радваме се да ви видим.
            </p>
          </div>

          <div className="mt-10">
            <AuthForm
              handleEmail={handleEmailSignIn}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              handleGoogle={handleGoogleSignIn}
              message={message}
              isSignUp={false}
            />

            <div className="mt-8 text-center">
              <p className="text-[1.4rem] text-gray-600">
                Нямате акаунт?{' '}
                <Link
                  href="/signup"
                  className="font-semibold text-green-5 hover:text-green-dark transition-colors"
                >
                  Регистрирайте се тук
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
