/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import { CherryIcon } from '../icons/shared';

// Custom hook for intersection observer
function useInView(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, isInView };
}

const HeroAnimation: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [_videoLoaded, setVideoLoaded] = useState(false);
  const [animationError, setAnimationError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lottieRef = useRef<any>(null);

  const { ref: animationRef, isInView } = useInView(0.1);

  // Motion values for smooth mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth movement
  const springConfig = { damping: 25, stiffness: 700 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Transform values for parallax effect
  const containerX = useTransform(x, [-500, 500], [-20, 20]);
  const containerY = useTransform(y, [-500, 500], [-20, 20]);
  const videoY = useTransform(y, [-500, 500], [-10, 10]);
  const textY = useTransform(y, [-500, 500], [-5, 5]);

  // Handle Lottie animation based on visibility
  useEffect(() => {
    if (lottieRef.current && !animationError) {
      try {
        if (isInView) {
          console.log('Element is in view, playing animation');
          lottieRef.current.play();
        } else {
          console.log('Element is out of view, stopping animation');
          lottieRef.current.stop();
        }
      } catch (error) {
        console.error('Lottie animation error:', error);
        setAnimationError(true);
      }
    }
  }, [isInView, animationError]);

  // Memoized mouse move handler for performance
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      }
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  // Mouse event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Video loading and autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => {
        setVideoLoaded(true);
      };

      const handleCanPlayThrough = async () => {
        try {
          await video.play();
        } catch (error) {
          console.warn('Video autoplay failed:', error);
          // Fallback: try to play on user interaction
        }
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplaythrough', handleCanPlayThrough);

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
      };
    }
  }, []);

  // Handle video play on user interaction if autoplay failed
  const handleVideoClick = useCallback(async () => {
    if (videoRef.current && videoRef.current.paused) {
      try {
        await videoRef.current.play();
      } catch (error) {
        console.error('Manual video play failed:', error);
      }
    }
  }, []);

  // Text animation variants for staggered entrance
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.2,
      },
    },
  };

  const textItemVariants = {
    hidden: {
      x: 100,
      opacity: 0,
      rotateX: -90,
      scale: 0.8,
    },
    visible: {
      x: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        duration: 0.8,
      },
    },
  };

  // Character animation variants for SplitText
  const charVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      rotateX: -90,
      scale: 0.5,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        duration: 0.8,
      },
    },
  };

  // // GSAP-style SplitText utility
  // const SplitText = ({ children, className = '', variants, initial = 'hidden', animate = 'visible', ...props }) => {
  //   const text = typeof children === 'string' ? children : '';
  //   const chars = text.split('').map((char, index) => (
  //     <motion.span
  //       key={index}
  //       variants={variants}
  //       className="inline-block"
  //       style={{
  //         transformOrigin: 'center center',
  //       }}
  //       {...props}
  //     >
  //       {char === ' ' ? '\u00A0' : char}
  //     </motion.span>
  //   ));
  //
  //   return (
  //     <motion.span
  //       className={className}
  //       variants={{
  //         hidden: {},
  //         visible: {
  //           transition: {
  //             staggerChildren: 0.05,
  //             delayChildren: 0,
  //           },
  //         },
  //       }}
  //       initial={initial}
  //       animate={animate}
  //     >
  //       {chars}
  //     </motion.span>
  //   );
  // };

  return (
    <div ref={animationRef} className="flex items-center justify-center min-h-screen overflow-hidden">
      <motion.div
        ref={containerRef}
        className="hero-can-wrapper relative flex items-center justify-center"
        style={{
          x: containerX,
          y: containerY,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Lottie animation positioned behind and centered */}
        {/* {!animationError && ( */}
        {/*   <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden"> */}
        {/*     <div className="w-[300px] h-[400px] overflow-hidden"> */}
        {/*       <Lottie */}
        {/*         lottieRef={lottieRef} */}
        {/*         animationData={pixel} */}
        {/*         loop={false} */}
        {/*         autoplay={false} */}
        {/*         className="h-dvh w-[1200px] max-h-[600px] transform" */}
        {/*         onLoadedData={() => console.log('Lottie animation loaded')} */}
        {/*         onError={(error) => { */}
        {/*           console.error('Lottie error:', error); */}
        {/*           setAnimationError(true); */}
        {/*         }} */}
        {/*       /> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* )} */}

        {/* Left Cherry with popup animation */}
        {/* <motion.div */}
        {/*   className="absolute top-24 transform -translate-y-1/2 z-20 left-80" */}
        {/*   initial={{ scale: 0, rotate: -180, opacity: 0 }} */}
        {/*   animate={ */}
        {/*     isInView */}
        {/*       ? { */}
        {/*           scale: 1, */}
        {/*           rotate: 0, */}
        {/*           opacity: 1, */}
        {/*         } */}
        {/*       : { */}
        {/*           scale: 0, */}
        {/*           rotate: -180, */}
        {/*           opacity: 0, */}
        {/*         } */}
        {/*   } */}
        {/*   transition={{ */}
        {/*     duration: 8.8, */}
        {/*     delay: 0.3, */}
        {/*     type: 'spring', */}
        {/*     stiffness: 200, */}
        {/*     damping: 15, */}
        {/*   }} */}
        {/*   whileHover={{ */}
        {/*     scale: 1.1, */}
        {/*     rotate: 5, */}
        {/*     transition: { duration: 0.2 }, */}
        {/*   }} */}
        {/* > */}
        {/*   <CherryIcon className="drop-shadow-lg size-96" /> */}
        {/* </motion.div> */}

        {/* Right Cherry with popup animation */}
        <motion.div
          className="absolute top-80 transform -translate-y-1/2 z-20 right-72"
          initial={{ scale: 0, rotate: 180, opacity: 0 }}
          animate={
            isInView
              ? {
                  scale: 1,
                  rotate: 0,
                  opacity: 1,
                }
              : {
                  scale: 0,
                  rotate: 180,
                  opacity: 0,
                }
          }
          transition={{
            duration: 8.8,
            delay: 0.5,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          whileHover={{
            scale: 1.1,
            rotate: -5,
            transition: { duration: 0.2 },
          }}
        >
          <CherryIcon className="drop-shadow-lg size-96" />
        </motion.div>

        {/* Phone/Video positioned in front */}
        <motion.div
          className="hero-can relative z-10"
          style={{
            y: videoY,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.video
            ref={videoRef}
            preload="metadata"
            width="1200"
            height="800"
            loop
            muted
            autoPlay
            playsInline
            className={`w-[1200px] object-cover border border-white/10 cursor-pointer`}
            animate={{
              rotateY: isHovered ? 5 : 0,
              rotateX: isHovered ? -5 : 0,
            }}
            transition={{ duration: 0.3 }}
            onClick={handleVideoClick}
            onError={(e) => {
              console.error('Video loading error:', e);
            }}
          >
            {/* WebM for modern browsers */}
            <source src="/output.webm" type="video/webm; codecs=vp8" />
            {/* MP4 fallback for broader compatibility */}
            <source src="/output.mp4" type="video/mp4" />
            {/* Fallback text */}
            Your browser does not support the video tag.
          </motion.video>
        </motion.div>

        {/* Animated Text Section - Positioned to the right of the phone */}
        <motion.div
          className="absolute right-0 z-15 select-none"
          style={{
            y: textY,
          }}
          variants={textContainerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="flex flex-col space-y-4">
            {/* Main Title with SplitText */}
            {/* <h1 className="font-bungee  skew-x-12 text-primary text-6xl font-black drop-shadow-2xl"> */}
            {/*   <SplitText */}
            {/*     variants={charVariants} */}
            {/*     initial="hidden" */}
            {/*     animate={isInView ? 'visible' : 'hidden'} */}
            {/*     whileHover={{ */}
            {/*       skewX: 24, */}
            {/*     }} */}
            {/*   > */}
            {/*     CHERRY */}
            {/*   </SplitText> */}
            {/* </h1> */}

            {/* Floating background text effect */}
            <motion.div
              className="absolute -z-10 -top-4 -left-4 font-bungee text-8xl font-black text-white/5"
              animate={{
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              CHERRY
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroAnimation;
