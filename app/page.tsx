"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Twitter,
  Instagram,
  Youtube,
  Volume2,
  VolumeX,
  Clapperboard,
  Lollipop,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  // State for sound and jump scare effects
  const [muted, setMuted] = useState(false);
  const [jumpScare, setJumpScare] = useState(false);
  const [shake, setShake] = useState(false);

  // Refs for audio and footer
  const bgAudioRef = useRef<HTMLAudioElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver to trigger jump scare when footer is visible
  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setJumpScare(true);
          setShake(true);
          const timeout = setTimeout(() => setShake(false), 600);
          return () => clearTimeout(timeout);
        }
      },
      { threshold: 0.9 }
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto play audio on mount
  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.muted = true; // Start muted to satisfy autoplay rules
      const playPromise = bgAudioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            bgAudioRef.current!.muted = false; // Unmute immediately after autoplay is allowed
          })
          .catch(() => {
            // Autoplay failed, audio will stay muted until user interaction
          });
      }
    }
  }, []);

  // Handle user mute/unmute toggle
  const handleToggleMute = () => {
    if (bgAudioRef.current) {
      if (muted) {
        bgAudioRef.current.muted = false;
        bgAudioRef.current.play();
      } else {
        bgAudioRef.current.muted = true;
        bgAudioRef.current.pause();
      }
    }
    setMuted(!muted);
  };

  return (
    <main
      className={`relative w-full bg-black text-white overflow-x-hidden ${
        shake ? "animate-shake" : ""
      }`}
    >
      {/* Background layers */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/fog.png')] bg-cover bg-center animate-moveFog opacity-30" />
        <motion.img
          src="https://media.timeout.com/images/105962089/image.jpg"
          alt="Art the Clown"
          animate={{ scale: 1.05 }}
          transition={{ ease: "linear" }}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.2, 0.7] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
          className="absolute inset-0 bg-red-900/30 mix-blend-overlay"
        />
      </div>

      {/* Background audio */}
      <audio
        ref={bgAudioRef}
        src="https://cdn.pixabay.com/download/audio/2025/05/09/audio_b8b2e52547.mp3?filename=hide-from-the-clown-339207.mp3"
        loop
        autoPlay
        muted
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-sm bg-black/30">
        <div className="flex items-center gap-4">
          <div className="text-red-500 font-black text-xl md:text-2xl tracking-wider flex">
            ART <Lollipop className="mt-1" />
          </div>
          <nav className="hidden md:flex gap-6 text-gray-200/80">
            <a href="#home" className="hover:text-red-400 flex items-center gap-1">
              <Twitter size={16} />
              Home
            </a>
            <a href="#story" className="hover:text-red-400 flex items-center gap-1">
              <Instagram size={16} />
              Story
            </a>
            <a href="#gallery" className="hover:text-red-400 flex items-center gap-1">
              <Youtube size={16} />
              Gallery
            </a>
            <a href="#video" className="hover:text-red-400 flex items-center gap-1">
              <Clapperboard size={16} />
              Video
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMute}
            className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 transition"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <a className="px-3 py-2 bg-red-600/90 rounded text-sm font-semibold hover:brightness-110 transition">
            Enter
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative z-10 min-h-screen flex items-center justify-center px-6"
      >
        <div className="max-w-5xl text-center py-24">
          <motion.h1
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.6 }}
            className="text-7xl md:text-9xl font-black text-red-600 tracking-widest drop-shadow-[0_0_35px_rgba(255,0,0,0.9)]"
          >
            ART THE CLOWN
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1.6 }}
            className="text-gray-300 mt-6 text-lg md:text-xl tracking-wider max-w-3xl mx-auto"
          >
            The nightmare in the shadows awaits. Dare you scroll further?
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section
        id="story"
        className="relative z-10 min-h-screen flex items-center justify-center px-6 bg-black/80 py-24"
      >
        <div className="max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-6 drop-shadow-[0_0_20px_rgba(255,0,0,0.7)]">
            The Lore of Art the Clown
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed tracking-wide">
            Art the Clown is a sinister presence, known for stalking abandoned alleys and abandoned places. His sinister grin and silent movements make him a nightmare to behold. Few survive encounters with him, and legends say he thrives on fear itself.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="relative z-10 min-h-screen px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-8 text-center">
            Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Image
              width={1000}
              height={1000}
              alt="Art1"
              src="https://wallpaperaccess.com/full/9411149.jpg"
              className="w-full h-64 object-cover rounded shadow-lg hover:scale-105 transition"
            />
            <Image
              width={1000}
              height={1000}
              alt="Art2"
              src="https://wallpaperaccess.com/full/9411155.jpg"
              className="w-full h-64 object-cover rounded shadow-lg hover:scale-105 transition"
            />
            <Image
              width={1000}
              height={1000}
              alt="Art3"
              src="https://wallpaperaccess.com/full/9411142.jpg"
              className="w-full h-64 object-cover rounded shadow-lg hover:scale-105 transition"
            />
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section
        id="video"
        className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24 bg-black/90"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-6 drop-shadow-[0_0_20px_rgba(255,0,0,0.7)]">
            Cinematic Encounter
          </h2>
          <video className="w-full rounded shadow-lg" autoPlay loop muted>
            <source
              src="https://yourimageshare.com/ib/k0wXdjaPuC.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Jump Scare Overlay */}
      <AnimatePresence>
        {jumpScare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <motion.img
              src="https://wallpapers.com/images/hd/creepy-clown-with-sunflower-eyeglasses-gspgyyexp51bk6yb.jpg"
              alt="jumpscare"
              initial={{ scale: 1.3 }}
              animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.6 }}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setJumpScare(false)}
              className="absolute top-10 right-10 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer
        ref={footerRef}
        className="relative z-10 bg-black/70 border-t border-white/6 py-8"
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Art the Clown — Demo
          </div>
          <div className="flex items-center gap-4">
            <Twitter
              size={18}
              className="text-gray-300 hover:text-red-400 transition"
            />
            <Instagram
              size={18}
              className="text-gray-300 hover:text-red-400 transition"
            />
            <Youtube
              size={18}
              className="text-gray-300 hover:text-red-400 transition"
            />
          </div>
        </div>
      </footer>
    </main>
  );
}
