'use client';

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

import { CherryIcon } from '../icons/shared';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isMounted, setIsMounted] = useState(false);

  // Motion values for smooth cursor movement
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Spring animation for smooth following
  const springX = useSpring(cursorX, {
    stiffness: 300,
    damping: 30,
    mass: 0.9,
  });
  const springY = useSpring(cursorY, {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
  });

  // Ensure component only renders on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const updateMousePosition = (e: any) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseOver = (e: any) => {
      const target = e.target;
      const interactiveElement = target.closest('button, a, [role="button"], input, textarea, [data-cursor="hover"]');

      if (interactiveElement) {
        setIsHovering(true);
        const tagName = interactiveElement.tagName.toLowerCase();
        const role = interactiveElement.getAttribute('role');

        if (tagName === 'button' || role === 'button') {
          setCursorVariant('button');
        } else if (tagName === 'a') {
          setCursorVariant('link');
        } else if (tagName === 'input' || tagName === 'textarea') {
          setCursorVariant('input');
        } else {
          setCursorVariant('hover');
        }
      } else {
        setIsHovering(false);
        setCursorVariant('default');
      }
    };

    const handleMouseOut = (e: any) => {
      const target = e.target;
      const relatedTarget = e.relatedTarget;
      const leavingInteractive = target.closest('button, a, [role="button"], input, textarea, [data-cursor="hover"]');
      const enteringInteractive = relatedTarget?.closest(
        'button, a, [role="button"], input, textarea, [data-cursor="hover"]'
      );

      if (leavingInteractive && !enteringInteractive) {
        setIsHovering(false);
        setCursorVariant('default');
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
      setIsHovering(false);
      setCursorVariant('default');
    };

    // Add event listeners
    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
    };
  }, [cursorX, cursorY, isMounted]);

  // Cursor variants for different states
  const cursorVariants = {
    default: {
      scale: 1,
      rotate: 0,
      opacity: 1,
    },
    hover: {
      scale: 1.2,
      rotate: 10,
      opacity: 1,
    },
    button: {
      scale: 1.4,
      rotate: 15,
      opacity: 1,
    },
    link: {
      scale: 1.3,
      rotate: -10,
      opacity: 1,
    },
    input: {
      scale: 0.9,
      rotate: 0,
      opacity: 0.8,
    },
    click: {
      scale: 0.8,
      rotate: 25,
      opacity: 1,
    },
  };

  // Don't render on server or if not mounted
  if (!isMounted || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: springX,
          y: springY,
          transform: 'translate(-50%, -50%)',
          left: 0,
          top: 0,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          variants={cursorVariants}
          animate={isClicking ? 'click' : cursorVariant}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
        >
          <motion.div
            animate={{
              y: isHovering ? -3 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              repeat: isHovering ? Infinity : 0,
              repeatType: 'reverse',
              duration: 0.6,
            }}
          >
            <CherryIcon />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomCursor;
