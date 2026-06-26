'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FooterContent = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
    alert('Благодарим ви за абонамента!');
  };

  return (
    <div className="bg-gradient-to-r from-[#faf2ed] via-white to-[#eef4f0] pt-28 pb-16 font-sans text-[#0f3b57]">
      <div className="section_wrapper">
        
        {/* Top Area: Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          
          {/* 1. Left Column: Logo & Newsletter */}
          <div className="lg:col-span-3 flex flex-col justify-start">
            <Link href="/" className="mb-10">
              <Image
                src="/logo-ctr.svg"
                alt="Little Bloom Creations"
                width={220}
                height={60}
                className="w-[24rem] h-auto object-contain"
              />
            </Link>
            
            <div className="space-y-8 max-w-[340px]">
              <p className="text-[1.6rem] text-[#0f3b57] leading-[1.6]">
                Receive exclusive offers, new collection news, and more when you subscribe.
              </p>
              
              <form onSubmit={handleSubscribe} className="relative mt-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-[5.5rem] rounded-[3rem] pl-8 pr-[13rem] text-[1.6rem] border-[#d8e0e5] bg-white shadow-sm focus-visible:ring-[#0f3b57] placeholder:text-[#889fb0]"
                />
                <Button 
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 h-auto rounded-[3rem] bg-transparent hover:bg-[#f0f4f7] text-[#0f3b57] font-semibold text-[1.6rem] px-8 transition-colors"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* 2. Middle Column: Links */}
          <div className="lg:col-span-2 flex flex-col gap-8 text-[1.7rem] lg:pt-2 font-medium lg:ml-12">
            <Link href="/categories" className="text-[#0f3b57] hover:text-[#2d6f9b] transition-colors">Всички продукти</Link>
            <Link href="/categories/albums" className="text-[#0f3b57] hover:text-[#2d6f9b] transition-colors">Фотоалбуми</Link>
            <Link href="/categories/diaries" className="text-[#0f3b57] hover:text-[#2d6f9b] transition-colors">Дневници</Link>
          </div>
          
          {/* 3. Middle Column: Links */}
          <div className="lg:col-span-2 flex flex-col gap-8 text-[1.7rem] lg:pt-2 font-medium lg:ml-8">
            <Link href="/about" className="text-[#0f3b57] hover:text-[#2d6f9b] transition-colors">За нас</Link>
            <Link href="/how-to-order" className="text-[#0f3b57] hover:text-[#2d6f9b] transition-colors">Как се поръчва</Link>
            <Link href="/faq" className="text-[#0f3b57] hover:text-[#2d6f9b] transition-colors">Често задавани въпроси</Link>
          </div>

          {/* 4. Middle Column: Links */}
          <div className="lg:col-span-2 flex flex-col gap-8 text-[1.7rem] lg:pt-2 font-medium lg:ml-4">
            <Link href="/terms" className="text-[#0f3b57] hover:text-[#2d6f9b] transition-colors">Общи условия</Link>
            <Link href="/privacy" className="text-[#0f3b57] hover:text-[#2d6f9b] transition-colors">Поверителност</Link>
            <Link href="/contact" className="text-[#0f3b57] hover:text-[#2d6f9b] transition-colors">Контакти</Link>
          </div>

          {/* 5. Right Column: Promo Card */}
          <div className="lg:col-span-3 relative rounded-[2rem] overflow-hidden h-[340px] lg:h-[400px] w-full max-w-[380px] group ml-auto shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4a4642] to-[#2a2825] transition-transform duration-700 group-hover:scale-105" />
            
            <div className="absolute inset-0 flex flex-col justify-center p-10 text-white text-center sm:text-left">
              <h3 className="text-[2.6rem] font-bold tracking-tight mb-4 mt-auto">
                Специални събития
              </h3>
              <p className="text-[1.6rem] text-white/90 mb-8 leading-relaxed">
                Комплекти за кръщене, изписване и корпоративни подаръци.
              </p>
              <Link href="/contact">
                <Button className="w-fit bg-white text-[#0f3b57] hover:bg-slate-100 rounded-[3rem] px-8 py-6 h-auto text-[1.6rem] font-bold transition-colors shadow-sm mx-auto sm:mx-0">
                  Поискай оферта
                </Button>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Area: Bottom Bar */}
        <div className="border-t border-[#d8e0e5] pt-12 flex flex-col md:flex-row items-center justify-between gap-8 text-[1.4rem] text-[#0f3b57]/80">
          
          <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-14">
            
            <div className="flex flex-col items-start gap-1">
              <span className="text-[1.3rem] text-[#0f3b57]/60">A brand of</span>
              <div className="font-bold text-[2.2rem] text-[#0f3b57] tracking-tight">
                Little Bloom
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8 mt-6 sm:mt-0">
              <span className="flex items-center gap-3 font-medium bg-white px-4 py-2 rounded-[2rem] shadow-sm">
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-white via-green-600 to-red-600 border border-slate-200"></span>
                Bulgaria
              </span>
              <span>© Little Bloom, 2026</span>
              <Link href="/terms" className="hover:text-[#2d6f9b] transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-[#2d6f9b] transition-colors">Privacy</Link>
              <Link href="/cookies" className="hover:text-[#2d6f9b] transition-colors">Cookies</Link>
              <Link href="/contact" className="hover:text-[#2d6f9b] transition-colors">Accessibility</Link>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-8">
            <Link 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#0f3b57] hover:text-[#2d6f9b] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <span className="sr-only">Instagram</span>
            </Link>
            <Link 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#0f3b57] hover:text-[#2d6f9b] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              <span className="sr-only">TikTok</span>
            </Link>
            <Link 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#0f3b57] hover:text-[#2d6f9b] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              <span className="sr-only">YouTube</span>
            </Link>
            <Link 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#0f3b57] hover:text-[#2d6f9b] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              <span className="sr-only">Facebook</span>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FooterContent;
