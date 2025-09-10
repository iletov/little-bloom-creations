import { GalleryPageProps } from '@/app/(store)/gallery/page';
import GalleryContainer from './GalleryContainer';
import Skeleton from './Skeleton';

const Gallery = ({ data }: { data: GalleryPageProps[] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="section_wrapper_xl">
        <Skeleton />;
      </div>
    );
  }

  return (
    <div className="section_wrapper_xl">
      <div className="grid-container">
        {data?.map((category: GalleryPageProps, index: number) => (
          <GalleryContainer key={category._id} data={category} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
