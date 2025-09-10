import Link from 'next/link';
import React from 'react';

export const FooterLinks = ({ data }: any) => {
  return (
    <ul className="flex gap-4 text-center justify-center">
      {data?.map((link: any, index: number) => (
        <Link href={`/${link?.slug.current}`} key={index}>
          <li className="text-[0.75rem] text-mango hover:text-mango/80 transition-colors linear duration-300 normal-case tracking-wider">
            {link?.title}
          </li>
        </Link>
      ))}
    </ul>
  );
};
