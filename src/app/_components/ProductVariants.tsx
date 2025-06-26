/* eslint-disable @typescript-eslint/no-unused-vars */
import { Money } from '@shopify/hydrogen-react';

import type { ProductVariant } from '@shopify/hydrogen-react/storefront-api-types';

interface OptionWithValues {
  name: string;
  values: string[];
}

interface SelectedOptions {
  [key: string]: string;
}

interface ProductVariantsProps {
  options: OptionWithValues[];
  selectedOptions: SelectedOptions;
  selectedVariant?: ProductVariant | null;
  onOptionChange: (name: string, value: string) => void;
  isOptionInStock: (name: string, value: string) => boolean;
}

const getColorValue = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    // Basic colors
    red: '#ef4444',
    green: '#10b981',
    blue: '#3b82f6',
    yellow: '#f59e0b',
    purple: '#8b5cf6',
    pink: '#ec4899',
    orange: '#f97316',
    black: '#000000',
    white: '#ffffff',
    gray: '#6b7280',
    grey: '#6b7280',

    // Extended colors
    beige: '#f5f5dc',
    bronze: '#cd7f32',
    brown: '#8b4513',
    navy: '#1e3a8a',
    teal: '#14b8a6',
    lime: '#84cc16',
    indigo: '#6366f1',
    violet: '#7c3aed',
    rose: '#f43f5e',
    emerald: '#10b981',
    sky: '#0ea5e9',
    amber: '#f59e0b',
    cyan: '#06b6d4',
    slate: '#64748b',
    zinc: '#71717a',
    neutral: '#737373',
    stone: '#78716c',

    // Metallic colors
    gold: '#ffd700',
    silver: '#c0c0c0',
    copper: '#b87333',

    // Fashion colors
    burgundy: '#800020',
    maroon: '#800000',
    cream: '#fffdd0',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    olive: '#808000',
    coral: '#ff7f50',
    salmon: '#fa8072',
    turquoise: '#40e0d0',
    magenta: '#ff00ff',
    mint: '#98fb98',
    lavender: '#e6e6fa',
  };

  return colorMap[colorName.toLowerCase()] || '#d1d5db';
};

export default function ProductVariants({
  options,
  selectedOptions,
  selectedVariant,
  onOptionChange,
  isOptionInStock,
}: ProductVariantsProps) {
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Color Options */}
      {options.map((option) => (
        <div key={option.name} className="space-y-3">
          {/* option.name */}
          <h3 className="text-base font-medium text-black uppercase tracking-wide">Select Colour</h3>
          <div className="flex items-center space-x-3">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const isAvailable = isOptionInStock(option.name, value);
              const colorValue = getColorValue(value);

              return (
                <button
                  key={value}
                  onClick={() => onOptionChange(option.name, value)}
                  disabled={!isAvailable}
                  className={`
                    relative transition-all duration-300
                    ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                    ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                  `}
                  title={value}
                >
                  <div
                    className={`
                      w-8 h-8 border-2 transition-all duration-300 relative
                      ${isSelected ? 'border-primary ' : 'border-gray-300'}
                      ${colorValue === '#ffffff' ? 'shadow-inner' : ''}
                    `}
                    style={{ backgroundColor: colorValue }}
                  >
                    {/* {isSelected && ( */}
                    {/*   <div className="absolute inset-0 flex items-center justify-center"> */}
                    {/*     <Check */}
                    {/*       className={`w-3 h-3 ${colorValue === '#ffffff' || colorValue === '#f5f5dc' || colorValue === '#fffdd0' || colorValue === '#fffff0' ? 'text-gray-800' : 'text-white'} drop-shadow`} */}
                    {/*     /> */}
                    {/*   </div> */}
                    {/* )} */}
                  </div>
                  {!isAvailable && <div className="absolute inset-0 bg-gray-200 bg-opacity-50 "></div>}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Current Selection */}
      {/* {selectedVariant && ( */}
      {/*   <div className="bg-gray-50  p-4"> */}
      {/*     <div className="flex items-center justify-between"> */}
      {/*       <div> */}
      {/*         <div className="font-medium text-gray-900">{selectedVariant.title}</div> */}
      {/*         <Money data={selectedVariant.price} className="text-lg font-bold text-primary" /> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* )} */}
    </div>
  );
}
