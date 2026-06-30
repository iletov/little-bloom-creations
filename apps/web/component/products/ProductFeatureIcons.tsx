import React from 'react';
import { HeartHandshake, Wand2, Layers, Palette, CheckCircle2 } from 'lucide-react';

interface ProductFeatureIconsProps {
  features?: string[];
}

const FEATURE_ICON_MAP: Record<string, React.ElementType> = {
  'ръчна изработка': HeartHandshake,
  'персонализирано': Wand2,
  'варианти': Layers,
  'цветове': Palette,
};

const getIconForFeature = (feature: string) => {
  const lowercaseFeature = feature.toLowerCase();
  
  // Find the matching icon component from the map, default to CheckCircle2
  const match = Object.entries(FEATURE_ICON_MAP).find(([key]) => lowercaseFeature.includes(key));
  const IconComponent = match ? match[1] : CheckCircle2;
  
  // Classes and styles are managed in one place
  return <IconComponent className="w-12 h-12 text-green-dark" strokeWidth={1.5} />;
};

export const ProductFeatureIcons = ({ features }: ProductFeatureIconsProps) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center sm:justify-evenly items-center gap-8 lg:gap-12 py-6 font-montserrat">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center gap-3 text-center min-w-[80px]">
          <div className="w-20 h-20 rounded-full bg-green-1/50 flex items-center justify-center">
            {getIconForFeature(feature)}
          </div>
          <span className="text-[1.2rem] sm:text-[1.3rem] font-medium text-slate-700 leading-tight">
            {feature}
          </span>
        </div>
      ))}
    </div>
  );
};
