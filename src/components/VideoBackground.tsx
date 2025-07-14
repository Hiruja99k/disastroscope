import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface VideoBackgroundProps {
  src?: string;
  fallbackImage: string;
  className?: string;
  children?: React.ReactNode;
}

export default function VideoBackground({ 
  src, 
  fallbackImage, 
  className = "",
  children 
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [useVideo, setUseVideo] = useState(!!src);

  useEffect(() => {
    if (videoRef.current && src) {
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        setVideoLoaded(true);
        video.play().catch(() => {
          // Fallback to image if video fails to play
          setUseVideo(false);
        });
      };
      
      const handleError = () => {
        setUseVideo(false);
      };
      
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {useVideo && src ? (
        <>
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={src} type="video/mp4" />
          </video>
          
          {/* Fallback image while video loads */}
          <motion.div
            className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ backgroundImage: `url(${fallbackImage})` }}
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      ) : (
        // Animated fallback image
        <motion.div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${fallbackImage})` }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/95"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}