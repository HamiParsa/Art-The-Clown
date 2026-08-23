/**
 * @fileoverview Art The Clown - Ultimate Horror Experience
 * @description Next-gen horror landing page with cutting-edge animations
 * @version 4.0.0
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from "framer-motion";
import {
  Twitter,
  Instagram,
  Youtube,
  Volume2,
  VolumeX,
  Clapperboard,
  Lollipop,
  Menu,
  X,
  Play,
  Pause,
} from "lucide-react";
import Image from "next/image";

// ============================================================================
// TYPES & CONFIGURATION
// ============================================================================

interface NavItem {
  label: string;
  href: string;
}

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
}

interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Story", href: "#story" },
  { label: "Gallery", href: "#gallery" },
  { label: "Videos", href: "#videos" },
  { label: "Reviews", href: "#reviews" },
];

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    src: "https://wallpaperaccess.com/full/9411149.jpg",
    alt: "Art the Clown portrait",
    title: "Sinister Smile",
  },
  {
    id: "2",
    src: "https://wallpaperaccess.com/full/9411155.jpg",
    alt: "Art the Clown dark",
    title: "Dark Presence",
  },
  {
    id: "3",
    src: "https://wallpaperaccess.com/full/9411142.jpg",
    alt: "Art the Clown horror",
    title: "Nightmare Fuel",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    text: "The most terrifying experience I've ever had. Art the Clown haunts my dreams.",
    author: "Sarah M.",
    role: "Horror Enthusiast",
  },
  {
    id: "2",
    text: "A masterpiece of modern horror. The visuals are absolutely stunning.",
    author: "James R.",
    role: "Film Critic",
  },
  {
    id: "3",
    text: "This is what true horror looks like. Pure nightmare fuel.",
    author: "Emily K.",
    role: "Content Creator",
  },
];

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Custom hook for audio control - starts muted, plays on user click
 */
const useAudioControl = () => {
  const [isMuted, setIsMuted] = useState(true); // Start muted
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(
      "https://cdn.pixabay.com/download/audio/2025/05/09/audio_b8b2e52547.mp3?filename=hide-from-the-clown-339207.mp3"
    );
    audio.loop = true;
    audio.volume = 0.5;
    audio.muted = true; // Always start muted
    audioRef.current = audio;

    // Try to autoplay muted
    const initAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // Autoplay blocked by browser - will start on user interaction
        console.log("Autoplay blocked, waiting for user interaction");
      }
    };

    initAudio();

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
    
    // If unmuting and audio is paused, play it
    if (!newMuted && audioRef.current.paused) {
      audioRef.current.play().catch(() => {
        // Handle any playback errors silently
      });
    }
    
    // If muting and audio is playing, pause it
    if (newMuted && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [isMuted]);

  return { isMuted, isPlaying, toggleMute };
};

/**
 * Custom hook for mobile menu
 */
const useMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, toggle, close };
};

/**
 * Custom hook for mouse tracking
 */
const useMouseTracking = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseX.set((clientX - centerX) / centerX);
    mouseY.set((clientY - centerY) / centerY);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return { mouseX, mouseY };
};

/**
 * Custom hook for scroll-triggered animations
 */
const useScrollTrigger = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Interactive Background with mouse tracking
 */
const InteractiveBackground: React.FC = () => {
  const { mouseX, mouseY } = useMouseTracking();

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <motion.div
        style={{
          x: useTransform(mouseX, [-1, 1], [0, -20]),
          y: useTransform(mouseY, [-1, 1], [0, -20]),
        }}
        className="absolute inset-0"
      >
        <Image
          src="https://media.timeout.com/images/105962089/image.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </motion.div>
      
      <div className="absolute inset-0 bg-linear-to-b from-black/90 via-black/70 to-black/95" />
      
      <motion.div
        className="absolute inset-0 bg-red-900/30"
        animate={{
          opacity: [0.1, 0.4, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-red-600/20 blur-3xl pointer-events-none"
        style={{
          x: useTransform(mouseX, [-1, 1], ["-50%", "50%"]),
          y: useTransform(mouseY, [-1, 1], ["-50%", "50%"]),
        }}
      />
    </div>
  );
};

/**
 * Custom cursor
 */
const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", moveCursor);
    
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", handleMouseOver);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.querySelectorAll("a, button").forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseOver);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed z-50 pointer-events-none mix-blend-difference"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: isHovering ? 2 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </motion.div>
      <motion.div
        className="fixed z-50 pointer-events-none border border-white/30 rounded-full"
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          scale: isHovering ? 0.5 : 1,
          opacity: isHovering ? 0 : 0.5,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
      >
        <div className="w-10 h-10" />
      </motion.div>
    </>
  );
};

/**
 * Header with glassmorphism
 */
const Header: React.FC<{ isMuted: boolean; onToggleMute: () => void }> = ({
  isMuted,
  onToggleMute,
}) => {
  const { isOpen, toggle, close } = useMobileMenu();
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]
  );

  return (
    <motion.header
      style={{ backgroundColor: headerBg }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 backdrop-blur-xl border-b border-white/5 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-red-600 rounded-full blur-xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Lollipop className="w-8 h-8 text-red-500 relative" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            ART<span className="text-red-500">.</span>
          </span>
        </motion.div>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
              <motion.span
                className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-red-500 group-hover:w-full"
                initial={{ x: "-50%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-gray-300 hover:text-white border border-white/5"
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
            whileTap={{ scale: 0.9 }}
            aria-label={isMuted ? "Play audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </motion.button>

          <motion.a
            href="#story"
            className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-red-600 to-red-700 rounded-xl text-white font-semibold text-sm hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Enter</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>

          <motion.button
            onClick={toggle}
            className="md:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition text-gray-300 hover:text-white"
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-white/5 overflow-hidden"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={close}
                className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#story"
              onClick={close}
              className="block mt-2 px-4 py-3 bg-red-600 rounded-xl text-white font-semibold text-center"
            >
              Enter
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

/**
 * Hero with 3D tilt effect
 */
const HeroSection: React.FC = () => {
  const { mouseX, mouseY } = useMouseTracking();
  const rotateX = useTransform(mouseY, [-1, 1], [5, -5]);
  const rotateY = useTransform(mouseX, [-1, 1], [-5, 5]);

  return (
    <section id="home" className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          style={{ rotateX, rotateY }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-red-600/20 blur-3xl animate-pulse" />
          
          <motion.h1
            initial={{ opacity: 0, y: 100, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative text-7xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none"
          >
            <span className="text-white block relative">
              ART
              <motion.span
                className="absolute -inset-1 bg-red-600/20 blur-2xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </span>
            <span className="text-red-600 block mt-4 relative">
              THE CLOWN
              <motion.span
                className="absolute inset-0 bg-red-600/30 blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
            </span>
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
        >
          The nightmare in the shadows awaits. 
          <span className="text-red-400 block mt-2 font-semibold">Dare you scroll further?</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <motion.a
            href="#story"
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-linear-to-r from-red-600 to-red-700 rounded-2xl text-white font-bold text-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Enter the Darkness</span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="relative z-10"
            >
              ↓
            </motion.span>
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </motion.a>
          
          <motion.a
            href="#gallery"
            className="px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300"
            whileHover={{ scale: 1.05, borderColor: "rgba(239, 68, 68, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            View Gallery
          </motion.a>
        </motion.div>

        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 15, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2 text-gray-500 text-xs uppercase tracking-[0.3em]">
            <span>Scroll to explore</span>
            <div className="w-0.5 h-8 bg-linear-to-b from-red-500 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/**
 * Story with parallax image
 */
const StorySection: React.FC = () => {
  const { ref, isVisible } = useScrollTrigger();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);

  return (
    <section id="story" className="relative z-10 min-h-screen flex items-center px-4 py-24">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-500/10 rounded-full border border-red-500/20">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm font-medium tracking-wider">THE LORE</span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1]">
            The Dark
            <br />
            <span className="text-red-500 relative">
              Origins
              <motion.span
                className="absolute -inset-2 bg-red-600/20 blur-2xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </span>
          </h2>
          
          <p className="text-lg text-gray-400 leading-relaxed">
            Art the Clown is a sinister presence, known for stalking abandoned 
            alleys and forgotten places. His sinister grin and silent movements 
            make him a nightmare to behold. Few survive encounters with him, 
            and legends say he thrives on fear itself.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <motion.div
              whileHover={{ scale: 1.05, borderColor: "rgba(239, 68, 68, 0.3)" }}
              className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm transition-all duration-300"
            >
              <div className="text-red-500 font-black text-4xl">2016</div>
              <div className="text-gray-500 text-sm mt-1">First Appearance</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, borderColor: "rgba(239, 68, 68, 0.3)" }}
              className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm transition-all duration-300"
            >
              <div className="text-red-500 font-black text-4xl">∞</div>
              <div className="text-gray-500 text-sm mt-1">Fear Unleashed</div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          style={{ scale: imageScale, opacity: imageOpacity }}
          className="relative"
        >
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-red-500/20">
            <Image
              src="https://wallpaperaccess.com/full/9411149.jpg"
              alt="Art the Clown"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="absolute bottom-8 left-8 right-8"
            >
              <div className="flex items-center gap-4 text-white bg-black/30 backdrop-blur-xl rounded-2xl p-4 border border-white/5">
                <Lollipop className="w-6 h-6 text-red-500" />
                <span className="text-sm font-medium tracking-wide">Witness the horror</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/**
 * Gallery with 3 images - no categories
 */
const GallerySection: React.FC = () => {
  return (
    <section id="gallery" className="relative z-10 min-h-screen px-4 py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-500/10 rounded-full border border-red-500/20 mb-4">
            <Clapperboard className="w-4 h-4 text-red-500" />
            <span className="text-red-400 text-sm font-medium tracking-wider">GALLERY</span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
            Visual <span className="text-red-500">Horrors</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/5 hover:border-red-500/30 transition-all duration-500"
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white font-bold text-2xl mb-1">{item.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Videos section
 */
const VideosSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
  }, []);

  return (
    <section id="videos" className="relative z-10 min-h-screen flex items-center px-4 py-24">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-500/10 rounded-full border border-red-500/20 mb-4">
            <Youtube className="w-4 h-4 text-red-500" />
            <span className="text-red-400 text-sm font-medium tracking-wider">CINEMATIC</span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
            Watch the <span className="text-red-500">Nightmare</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-black shadow-2xl shadow-red-500/20 group"
        >
          <video
            ref={videoRef}
            className="w-full aspect-video"
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
            poster="https://wallpaperaccess.com/full/9411142.jpg"
            playsInline
          >
            <source
              src="https://yourimageshare.com/ib/k0wXdjaPuC.mp4"
              type="video/mp4"
            />
            Your browser does not support video.
          </video>

          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <motion.button
              onClick={togglePlay}
              className="p-8 rounded-full bg-red-600/80 hover:bg-red-600 backdrop-blur-xl transition-all duration-300 text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? <Pause size={40} /> : <Play size={40} />}
            </motion.button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <motion.div
              className="h-full bg-linear-to-r from-red-600 to-red-400"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/**
 * Reviews section
 */
const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="relative z-10 min-h-screen flex items-center px-4 py-24">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-500/10 rounded-full border border-red-500/20 mb-4">
            <span className="text-red-400 text-sm font-medium tracking-wider">TESTIMONIALS</span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white">
            What People <span className="text-red-500">Say</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/5 hover:border-red-500/20 transition-all duration-300"
            >
              <div className="flex items-center gap-1 text-red-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {testimonial.text}
              </p>
              <div>
                <p className="text-white font-semibold">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Footer
 */
const Footer: React.FC = () => {
  const socials = [
    { Icon: Twitter, color: "#1DA1F2", label: "Twitter" },
    { Icon: Instagram, color: "#E4405F", label: "Instagram" },
    { Icon: Youtube, color: "#FF0000", label: "YouTube" },
  ];

  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/60 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Lollipop className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-black text-white">
                ART<span className="text-red-500">.</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              The nightmare in the shadows awaits. Explore the dark world of Art the Clown
              through immersive visuals and cinematic experiences.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex flex-wrap gap-4">
              {socials.map(({ Icon, color, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 border border-white/5 hover:border-red-500/20"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ color }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Art the Clown. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Main application - Ultimate Art The Clown Experience
 */
export default function Home() {
  const { isMuted, toggleMute } = useAudioControl();

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <InteractiveBackground />
      <CustomCursor />
      <Header isMuted={isMuted} onToggleMute={toggleMute} />
      <HeroSection />
      <StorySection />
      <GallerySection />
      <VideosSection />
      <ReviewsSection />
      <Footer />
    </main>
  );
}