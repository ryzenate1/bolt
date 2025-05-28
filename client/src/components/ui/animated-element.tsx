'use client';

import { ReactNode } from 'react';
import { motion, Variant, MotionProps } from 'framer-motion';
import { useAnimatedInView, fadeInUp } from '@/hooks/useAnimatedInView';

interface AnimatedElementProps extends MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: {
    visible: Variant;
    hidden: Variant;
  };
  triggerOnce?: boolean;
  threshold?: number;
  as?: React.ElementType;
}

/**
 * A wrapper component that animates its children when they come into view
 */
export function AnimatedElement({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  animation = fadeInUp,
  triggerOnce = true,
  threshold = 0.1,
  as = 'div',
  ...props
}: AnimatedElementProps) {
  // Apply delay to the animation
  const animationWithDelay = {
    visible: {
      ...animation.visible,
      transition: {
        ...(animation.visible.transition || {}),
        delay,
        duration,
      },
    },
    hidden: animation.hidden,
  };

  const { ref, controls } = useAnimatedInView({
    visible: animationWithDelay.visible,
    hidden: animationWithDelay.hidden,
    triggerOnce,
    threshold,
  });

  const MotionComponent = motion[as as keyof typeof motion] || motion.div;

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={controls}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * Specialized animated components for common elements
 */

export function AnimatedHeading({
  children,
  className = '',
  level = 2,
  ...props
}: AnimatedElementProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <AnimatedElement
      as={HeadingTag}
      className={className}
      {...props}
    >
      {children}
    </AnimatedElement>
  );
}

export function AnimatedImage({
  src,
  alt,
  className = '',
  width,
  height,
  ...props
}: AnimatedElementProps & { 
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  return (
    <AnimatedElement
      as="div"
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
        width={width}
        height={height}
      />
    </AnimatedElement>
  );
}

export function AnimatedSection({
  children,
  className = '',
  ...props
}: AnimatedElementProps) {
  return (
    <AnimatedElement
      as="section"
      className={className}
      {...props}
    >
      {children}
    </AnimatedElement>
  );
}

export function AnimatedCard({
  children,
  className = '',
  ...props
}: AnimatedElementProps) {
  return (
    <AnimatedElement
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </AnimatedElement>
  );
}
