/* eslint-disable @typescript-eslint/no-unused-vars */
import { Money } from '@shopify/hydrogen-react';
import { ChevronDown } from 'lucide-react';

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

    // Phone colors
    'space gray': '#4a4a4a',
    'space grey': '#4a4a4a',
    'midnight green': '#004953',
    'pacific blue': '#1f4788',
    'sierra blue': '#a7c1d9',
    'alpine green': '#576856',
    'deep purple': '#5c2e7e',
    'gold rose': '#e6c7c2',
    starlight: '#faf7f2',
    midnight: '#1d1d1f',
    'product red': '#bf0013',
  };

  return colorMap[colorName.toLowerCase()] || '#d1d5db';
};

// Helper function to determine if option is color-related
const isColorOption = (optionName: string): boolean => {
  const colorKeywords = ['color', 'colour', 'finish'];
  return colorKeywords.some((keyword) => optionName.toLowerCase().includes(keyword));
};

// Helper function to determine if option is model/size related
const isModelOption = (optionName: string): boolean => {
  const modelKeywords = ['model', 'size', 'capacity', 'storage', 'version', 'type'];
  return modelKeywords.some((keyword) => optionName.toLowerCase().includes(keyword));
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

  // Helper function to check if it's a default title that should be hidden
  const isDefaultTitle = (optionName: string): boolean => {
    if (!optionName || typeof optionName !== 'string') return true;

    const defaultTitles = [
      'title',
      'default',
      'Default Title',
      'option',
      'variant',
      'default title',
      'default variant',
      'untitled',
      'no title',
    ];

    const normalizedName = optionName.toLowerCase().trim();

    // Check for exact matches or if the name contains default keywords
    return defaultTitles.some(
      (defaultTitle) => normalizedName === defaultTitle || normalizedName.includes(defaultTitle)
    );
  };

  // Helper function to format option title
  const formatOptionTitle = (optionName: string): string => {
    // If it's a default title, return empty string (will hide the heading)
    if (isDefaultTitle(optionName)) {
      return '';
    }

    // Otherwise, return "Select {OptionName}"
    return `Select ${optionName}`;
  };

  const renderColorOption = (option: OptionWithValues) => {
    const title = formatOptionTitle(option.name);

    return (
      <div key={option.name} className="space-y-3">
        {title && <h3 className="text-base font-medium text-black uppercase tracking-wide">{title}</h3>}
        <div className="flex items-center space-x-3 flex-wrap gap-2">
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
                  relative transition-all duration-300 group
                  ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                  ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                `}
                title={value}
              >
                <div
                  className={`
                    w-10 h-10 border-2 border-solid  transition-all duration-300 relative
                    ${isSelected ? 'border-primary shadow-lg' : 'border-gray-300'}
                    ${colorValue === '#ffffff' ? 'shadow-inner' : ''}
                  `}
                  style={{ backgroundColor: colorValue }}
                >
                  {!isAvailable && <div className="absolute inset-0 bg-gray-200 bg-opacity-50 rounded-full"></div>}
                </div>
                {/* Color name tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {value}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderModelOption = (option: OptionWithValues) => {
    const title = formatOptionTitle(option.name);
    const selectedValue = selectedOptions[option.name];

    return (
      <div key={option.name} className="space-y-3">
        {title && <h3 className="text-base font-medium text-black uppercase tracking-wide">{title}</h3>}
        <div className="relative">
          <select
            value={selectedValue || ''}
            onChange={(e) => onOptionChange(option.name, e.target.value)}
            className="w-full appearance-none bg-white border-solid border-2 border-primary  px-4 py-3 pr-10 text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          >
            <option value="" disabled>
              Choose {option.name.toLowerCase()}...
            </option>
            {option.values.map((value) => {
              const isAvailable = isOptionInStock(option.name, value);
              return (
                <option
                  key={value}
                  value={value}
                  disabled={!isAvailable}
                  className={!isAvailable ? 'text-gray-400' : ''}
                >
                  {value} {!isAvailable ? '(Out of Stock)' : ''}
                </option>
              );
            })}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    );
  };

  const renderGenericOption = (option: OptionWithValues) => {
    const title = formatOptionTitle(option.name);

    return (
      <div key={option.name} className="space-y-3">
        {title && <h3 className="text-base font-medium text-black uppercase tracking-wide">{title}</h3>}
        <div className="flex flex-wrap gap-2">
          {option.values.map((value) => {
            const isSelected = selectedOptions[option.name] === value;
            const isAvailable = isOptionInStock(option.name, value);
            const isDefault = isDefaultTitle(value);

            return isDefault ? null : (
              <button
                key={value}
                onClick={() => onOptionChange(option.name, value)}
                disabled={!isAvailable}
                className={`
                  px-3 py-2 border border-solid  text-sm font-medium transition-all duration-200
                  ${
                    isSelected
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }
                  ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {options.map((option) => {
        if (isColorOption(option.name)) {
          return renderColorOption(option);
        } else if (isModelOption(option.name)) {
          return renderModelOption(option);
        } else {
          return renderGenericOption(option);
        }
      })}

      {/* Current Selection Summary */}
      {selectedVariant && !isDefaultTitle(selectedVariant.title) && (
        <>
          <div className="bg-gray-50  p-4 border border-solid">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{selectedVariant.title}</div>
                {(() => {
                  const filteredOptions = Object.entries(selectedOptions)
                    .filter(([key, value]) => !isDefaultTitle(key) && !isDefaultTitle(value))
                    .map(([key, value]) => `${key}: ${value}`);

                  return (
                    filteredOptions.length > 0 && (
                      <div className="text-sm text-gray-600 mt-1">{filteredOptions.join(' • ')}</div>
                    )
                  );
                })()}
              </div>
              <div className="text-right">
                <Money data={selectedVariant.price} className="text-lg font-bold text-primary" />
                {selectedVariant.compareAtPrice && (
                  <Money data={selectedVariant.compareAtPrice} className="text-sm text-gray-500 line-through" />
                )}
              </div>
            </div>
          </div>
          <hr className="border-gray-200 border-2 border-solid" />
        </>
      )}
    </div>
  );
}
