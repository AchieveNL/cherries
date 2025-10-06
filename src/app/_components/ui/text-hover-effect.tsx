'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

export const TextHoverEffect = ({
  text,
  duration,
  maxCharsPerLine = 20,
  lineHeight = 1.2,
}: {
  text: string;
  duration?: number;
  maxCharsPerLine?: number;
  lineHeight?: number;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: '50%', cy: '50%' });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  // Split text into lines
  const splitTextIntoLines = (text: string) => {
    // Check if text already has manual line breaks
    if (text.includes('\n')) {
      return text.split('\n');
    }

    // Auto-wrap based on character count
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const lines = splitTextIntoLines(text);

  // Calculate viewBox height based on number of lines
  const viewBoxHeight = Math.max(200, lines.length * 80);

  // Render multi-line text
  const renderMultiLineText = (additionalProps: any = {}) => {
    const startY = lines.length === 1 ? 50 : 50 - (lines.length - 1) * lineHeight * 15;

    return lines.map((line, index) => (
      <motion.tspan
        key={index}
        x="55%"
        y={`${startY + index * lineHeight * 25}%`}
        textAnchor="left"
        dominantBaseline="left"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: index * 0.2,
          ease: 'easeOut',
        }}
        {...additionalProps}
      >
        {line}
      </motion.tspan>
    ));
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 1200 ${viewBoxHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none"
      style={{
        width: 1800,
        height: 'auto',
        minHeight: lines.length * 80,
      }}
    >
      <defs>
        <linearGradient id="textGradient" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="25%">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: '50%', cy: '50%' }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: 'easeOut' }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      {/* Background text */}
      <text
        className="fill-transparent stroke-neutral-200 font-bungee text-7xl font-thin dark:stroke-neutral-800"
        strokeWidth="0.3"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {renderMultiLineText()}
      </text>

      {/* Animated outline text */}
      <motion.text
        className="fill-transparent stroke-neutral-200 font-bungee text-7xl font-thin dark:stroke-neutral-800"
        strokeWidth="0.3"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
        }}
      >
        {renderMultiLineText()}
      </motion.text>

      {/* Gradient masked text */}
      <text
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-bungee text-7xl font-thin"
      >
        {renderMultiLineText()}
      </text>
    </svg>
  );
};
