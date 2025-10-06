/* eslint-disable @typescript-eslint/no-unused-vars */
import { MotionValue } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { createNoise2D } from 'simplex-noise';

const random = (min: number, max: number) => Math.random() * (max - min) + min;

// 8-bit pattern generator with scroll influence
const generate8BitPattern = (width: number, height: number, scrollOffset: number = 0): number[][] => {
  const pattern: number[][] = [];
  const noise2D = createNoise2D();

  for (let y = 0; y < height; y++) {
    pattern[y] = [];
    // Use scroll offset to vary terrain shape
    const baseHeight = height * 0.03 + Math.sin(y * 0.1) * height * 0.2;

    for (let x = 0; x < width; x++) {
      // Add noise with scroll variation
      const noiseX = x * 2;
      const noiseY = y * 2;
      const noise = noise2D(noiseX, noiseY) * random(0, 0.5);
      const localHeight = baseHeight + noise * height * 0.8;

      // Fill pixels below terrain line
      pattern[y][x] = height - y < localHeight ? 1 : 0;

      // Add scattered pixels above terrain with scroll variation
      if (pattern[y][x] === 0 && Math.random() < 0.06) {
        pattern[y][x] = noise;
      }
    }
  }
  return pattern;
};

// Optimized pixel border component using CSS box-shadow
const PixelBorder: React.FC<{
  pattern: number[][];
  pixelSize?: number;
  color?: string;
  className?: string;
}> = ({ pattern, pixelSize = 3, color = '#8B0000', className = '' }) => {
  const boxShadow = useMemo(() => {
    const shadows: string[] = [];
    for (let y = 0; y < pattern.length; y++) {
      for (let x = 0; x < pattern[y].length; x++) {
        if (pattern[y][x] === 1) {
          shadows.push(`${x * pixelSize}px ${y * pixelSize}px ${color}`);
        }
      }
    }
    return shadows.join(', ');
  }, [pattern, pixelSize, color]);

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: pattern[0]?.length * pixelSize || 0,
        height: pattern.length * pixelSize,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: pixelSize,
          height: pixelSize,
          boxShadow,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

interface BitBackgroundProps {
  scrollYProgress?: MotionValue<number>;
}

// Main component with scroll-based regeneration from parent
const BitBackground: React.FC<BitBackgroundProps> = ({ scrollYProgress }) => {
  const [pattern, setPattern] = useState<number[][]>([]);

  const generateNewPattern = (scrollValue: number) => {
    const newPattern = generate8BitPattern(150, 24, scrollValue);
    setPattern(newPattern);
  };

  // Initial pattern generation
  useEffect(() => {
    generateNewPattern(0);
  }, []);

  // Regenerate pattern based on parent's scroll
  useEffect(() => {
    if (!scrollYProgress) return;

    let lastScrollValue = 0;

    const unsubscribe = scrollYProgress.onChange((value) => {
      const scrollDelta = Math.abs(value - lastScrollValue);

      // Regenerate on significant scroll movement
      if (scrollDelta > 0.2) {
        generateNewPattern(value);
        lastScrollValue = value;
      }
    });

    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <div>
      {pattern.length > 0 && <PixelBorder pattern={pattern} pixelSize={24} color="#8B0000" className="mx-auto" />}
    </div>
  );
};

export default BitBackground;
