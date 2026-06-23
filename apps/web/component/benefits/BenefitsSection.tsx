import {
  Gift,
  HeartHandshake,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

export type BenefitIcon =
  | 'handmade'
  | 'personalization'
  | 'securePayment'
  | 'delivery';

export interface BenefitItem {
  _key: string;
  icon: BenefitIcon;
  title: string;
  description: string;
}

export interface BenefitsSectionData {
  benefitEyebrow?: string;
  benefitHeading?: string;
  benefitDescription?: string;
  benefitItems?: BenefitItem[];
}

interface BenefitsSectionProps {
  data: BenefitsSectionData;
}

const benefitIcons: Record<BenefitIcon, LucideIcon> = {
  handmade: HeartHandshake,
  personalization: Gift,
  securePayment: ShieldCheck,
  delivery: Truck,
};

const BenefitsSection = ({
  data,
}: BenefitsSectionProps): React.JSX.Element | null => {
  if (!data.benefitItems?.length) {
    return null;
  }

  return (
    <section
      className="border-y border-green-5/20 bg-green-0 py-12 sm:py-16 lg:py-24"
      aria-label="Основни предимства"
    >
      <div className="section_wrapper px-6 sm:px-8 xl:px-0">
        {data.benefitEyebrow ||
        data.benefitHeading ||
        data.benefitDescription ? (
          <header className="mx-auto mb-12 max-w-[84rem] space-y-4 text-center lg:mb-16">
            {data.benefitEyebrow?.trim() ? (
              <p className="font-montserrat text-[1.2rem] font-medium uppercase tracking-[0.28em] text-green-9 sm:text-[1.4rem]">
                {data.benefitEyebrow.trim()}
              </p>
            ) : null}
            {data.benefitHeading?.trim() ? (
              <h2 className="text-[3.2rem] font-semibold leading-[1.15] text-green-dark sm:text-[4rem] lg:text-[4.8rem]">
                {data.benefitHeading.trim()}
              </h2>
            ) : null}
            {data.benefitDescription?.trim() ? (
              <p className="mx-auto max-w-[70rem] font-montserrat text-[1.5rem] leading-[1.6] text-slate-600 sm:text-[1.6rem]">
                {data.benefitDescription.trim()}
              </p>
            ) : null}
          </header>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {data.benefitItems.map((item, index) => {
            const Icon = benefitIcons[item.icon] ?? HeartHandshake;

            return (
              <article
                key={item._key}
                className={cn(
                  'relative grid min-h-[24rem] grid-rows-[9rem_7rem_1fr] place-items-center content-center px-8 py-12 text-center lg:min-h-[32rem] lg:grid-rows-[11rem_7rem_1fr] lg:px-10 lg:py-16 font-montserrat',
                  index > 0 && 'border-t border-green-5/20',
                  index % 2 === 1 && 'sm:border-l sm:border-green-5/30',
                  index >= 2 && 'sm:border-t sm:border-green-5/20',
                  index === 2 && 'sm:border-l-0',
                  index > 0 && 'xl:border-l xl:border-t-0 xl:border-green-5/30',
                )}
              >
                <Icon
                  className="h-16 w-16 self-start text-green-5 lg:h-[7.2rem] lg:w-[7.2rem]"
                  strokeWidth={1.35}
                  aria-hidden="true"
                />
                <h3 className="max-w-[24rem] self-start text-[2.2rem] font-semibold leading-tight text-green-dark lg:text-[2.4rem]">
                  {item.title}
                </h3>
                <p className="max-w-[30ch] self-start text-[1.5rem] leading-[1.6] text-slate-600 lg:text-[1.6rem]">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
