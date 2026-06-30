import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import HighlightedHeading from '../heading-description/HighlightedHeading';
import { PortableTextContainer } from '../portabletext-container/PortableTextContainer';
import { ProductCarouselCard } from './ProductCarouselCard';

interface ProductCarouselProps {
  data: any;
}

export const ProductCarousel = ({ data }: ProductCarouselProps) => {
  const products = data?.carouselProducts || [];

  if (products.length === 0) return null;

  return (
    <section className="section-y-padding bg-pink-1">
      <div className="section_wrapper">
        {(data?.heading?.title || data?.description) && (
          <header className="flex flex-col items-center text-center gap-4 mb-12">
            {data?.heading?.title && (
              <HighlightedHeading
                text={data.heading.title}
                word={data.heading.highlightedWord}
                color={data.heading.highlightedColor}
                tag="h2"
              />
            )}
            {data?.description && (
              <div className="max-w-[800px] mx-auto">
                <PortableTextContainer data={data.description} />
              </div>
            )}
          </header>
        )}

        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {products.map((product: any, index: number) => (
              <CarouselItem
                key={`${product.slug?.current}-${index}`}
                className="pl-4 md:pl-6 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <ProductCarouselCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="hidden md:block">
            <CarouselPrevious className="-left-6 lg:-left-10 right-auto top-1/2 bottom-auto -translate-y-1/2 translate-x-0 h-12 w-12 lg:h-20 lg:w-20 [&>svg]:w-8 [&>svg]:h-8 lg:[&>svg]:w-16 lg:[&>svg]:h-16 border-white bg-white text-green-dark shadow-sm opacity-100 hover:bg-white hover:text-green-dark hover:opacity-100 disabled:opacity-100 disabled:hover:bg-white disabled:hover:text-green-dark" />
            <CarouselNext className="-right-6 lg:-right-10 left-auto top-1/2 bottom-auto -translate-y-1/2 translate-x-0 h-12 w-12 lg:h-20 lg:w-20 [&>svg]:w-8 [&>svg]:h-8 lg:[&>svg]:w-16 lg:[&>svg]:h-16 border-white bg-white text-green-dark shadow-sm opacity-100 hover:bg-white hover:text-green-dark hover:opacity-100 disabled:opacity-100 disabled:hover:bg-white disabled:hover:text-green-dark" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};
