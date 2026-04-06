/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "motion/react";
import { ChevronDown, MessageCircle, Sun, Moon, Zap } from "lucide-react";

// --- Types ---
type ThemeMode = 'normal' | 'night';

// --- Components ---

const GrainOverlay = () => <div className="grain-overlay" />;

const ScanlineOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.03] overflow-hidden">
    <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
  </div>
);

const ThemeSwitcher = ({ currentTheme, setTheme }: { currentTheme: ThemeMode, setTheme: (t: ThemeMode) => void }) => {
  return (
    <div className="fixed top-6 right-6 z-50 flex gap-2 bg-black/40 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-2xl">
      <button 
        onClick={() => setTheme('normal')}
        className={`p-2.5 rounded-full transition-all duration-500 ${currentTheme === 'normal' ? 'bg-gold text-black scale-110 shadow-[0_0_20px_rgba(212,175,55,0.5)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        title="Modo Normal"
      >
        <Sun size={20} />
      </button>
      <button 
        onClick={() => setTheme('night')}
        className={`p-2.5 rounded-full transition-all duration-500 ${currentTheme === 'night' ? 'bg-fuchsia-600 text-white scale-110 shadow-[0_0_20px_rgba(192,38,211,0.5)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        title="Modo Noche"
      >
        <Moon size={20} />
      </button>
    </div>
  );
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
}

const Reveal = ({ children, className = "" }: RevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: [0.2, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Counter = ({ target, prefix = "", suffix = "", theme, isHovered }: { target: number; prefix?: string; suffix?: string; theme?: ThemeMode; isHovered: boolean }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const isNight = theme === 'night';

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <span ref={ref} className={`text-5xl md:text-6xl font-bold transition-all duration-500 ${isNight ? 'text-fuchsia-500 font-night' : 'text-gold font-sans'} ${isHovered ? (isNight ? 'drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]' : 'drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]') : ''}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// --- Sections ---

const AnimatedLetter = ({ char, index, isGold = false, hoverColor = "#D4AF37", forceColor, theme }: { char: string; index: number; isGold?: boolean; hoverColor?: string; forceColor?: string; theme?: ThemeMode; key?: React.Key }) => {
  const isNight = theme === 'night';
  
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        color: forceColor || (isGold ? "#D4AF37" : undefined)
      }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ 
        y: isNight ? 0 : -10, 
        scale: isNight ? 1.3 : 1.1,
        color: isNight ? "#FFFFFF" : hoverColor,
        textShadow: isNight ? "0 0 20px rgba(217, 70, 239, 0.8), 0 0 40px rgba(217, 70, 239, 0.4)" : "0 0 20px rgba(212, 175, 55, 0.8)",
        transition: { duration: 0.2 } 
      }}
      className={`inline-block cursor-default ${isNight ? 'font-night font-bold uppercase tracking-tighter' : 'font-serif'}`}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
};

const Hero = ({ theme }: { theme: ThemeMode }) => {
  const firstName = "MAURICIO".split("");
  const lastName = "MOREIRA".split("");
  const isNight = theme === 'night';

  return (
    <header className={`min-h-screen flex flex-col justify-center px-6 relative transition-all duration-1000 pt-20 ${isNight ? 'bg-[#050505]' : 'bg-plomo-fondo items-center text-center'}`}>
      {/* Night Mode Grid Background */}
      {isNight && (
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      )}

      <div className={`relative z-10 w-full ${isNight ? 'max-w-6xl mx-auto' : ''}`}>
        <Reveal className="active">
          <div className={`flex flex-col ${isNight ? 'items-start text-left' : 'items-center'}`}>
            <h1 className={`text-6xl md:text-9xl tracking-tighter mb-6 flex flex-wrap ${isNight ? 'justify-start gap-x-12' : 'justify-center gap-x-4'}`}>
              <span className="flex">
                {firstName.map((char, i) => (
                  <AnimatedLetter 
                    key={i} 
                    char={char} 
                    index={i} 
                    theme={theme}
                    forceColor={isNight ? "#E5E4E2" : undefined}
                    hoverColor={isNight ? "#d946ef" : "#D4AF37"}
                  />
                ))}
              </span>
              <span className="flex">
                {lastName.map((char, i) => (
                  <AnimatedLetter 
                    key={i + firstName.length} 
                    char={char} 
                    index={i + firstName.length} 
                    isGold={!isNight}
                    theme={theme}
                    hoverColor={isNight ? "#d946ef" : "#000000"}
                    forceColor={isNight ? "#E5E4E2" : undefined}
                  />
                ))}
              </span>
            </h1>
            
            <div className={`flex flex-col ${isNight ? 'items-start' : 'items-center'} w-full`}>
              <h2 className={`text-sm md:text-lg uppercase tracking-[0.5em] mt-8 mb-4 font-semibold transition-all duration-500 ${isNight ? 'font-night text-fuchsia-500 bg-fuchsia-500/10 px-6 py-2 border border-fuchsia-500/20' : 'text-dark-bg/70'}`}>
                High Ticket Closer
              </h2>
              <div className={`h-0.5 my-6 transition-all duration-700 ${isNight ? 'bg-fuchsia-500 w-full max-w-md shadow-[0_0_20px_rgba(217,70_239,0.6)]' : 'gold-line w-24'}`} />
              <p className={`text-xl md:text-3xl max-w-2xl leading-relaxed transition-all duration-500 ${isNight ? 'font-night text-left text-white/70 uppercase tracking-tight' : 'text-dark-bg italic font-serif'}`}>
                Trabajando con conexión real, que por fin tu cliente se sienta entendido.
              </p>
            </div>
          </div>
        </Reveal>


        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`mt-20 transition-opacity duration-500 flex ${isNight ? 'justify-start' : 'justify-center'} opacity-30`}
        >
          <ChevronDown size={32} color={isNight ? "#C0C0C0" : "black"} />
        </motion.div>
      </div>
    </header>
  );
};

const Stats = ({ theme }: { theme: ThemeMode }) => {
  const isNight = theme === 'night';
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <section className={`py-24 transition-all duration-1000 relative overflow-hidden ${isNight ? 'bg-[#000000] border-y border-white/10' : 'bg-dark-bg text-white'}`}>
      <img 
        src={isNight ? "https://picsum.photos/seed/tech-grid/1920/1080?grayscale&blur=20" : "https://picsum.photos/seed/dark-cinematic/1920/1080?grayscale"} 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none"
        referrerPolicy="no-referrer"
      />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center max-w-4xl mx-auto">
          {[
            { target: 40, label: "Closing Rate Reciente", suffix: "%" },
            { target: 3000, label: "Ticket Promedio Cerrado", prefix: "$" }
          ].map((stat, i) => (
            <Reveal key={i}>
              <motion.div
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                whileHover={{ 
                  scale: 1.05,
                  filter: isNight ? "drop-shadow(0 0 20px rgba(217, 70, 239, 0.3))" : "drop-shadow(0 0 15px rgba(212, 175, 55, 0.8))",
                }}
                className={`transition-all duration-300 cursor-default p-6 rounded-2xl ${isNight ? 'border border-fuchsia-500/10 bg-fuchsia-500/[0.02]' : ''}`}
              >
                <div className="flex flex-col">
                  <Counter target={stat.target} prefix={stat.prefix} suffix={stat.suffix} theme={theme} isHovered={hoveredIndex === i} />
                  <p className={`uppercase tracking-widest transition-colors ${isNight ? 'text-sm mt-1 text-fuchsia-400 font-night font-bold' : 'text-xs mt-3 opacity-50'}`}>
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Trajectory = ({ theme }: { theme: ThemeMode }) => {
  const experiences = [
    {
      name: "Alberto Sardiñas",
      product: "Anónimo No Más",
      tag: "SETTING & CLOSING",
      description: "Además de haber trabajado como setter y closer para Alberto, optimicé la estrategia del producto y mejoré directamente la experiencia del cliente para elevar la tasa de retención."
    },
    {
      name: "Gus Sevilla",
      product: "Tus Primeros 100K",
      tag: "CLOSING",
      description: "Gestión de ventas de alto impacto como closer para su comunidad de Marketing de Afiliados, liderando procesos de cierre de alta temperatura."
    }
  ];

  const isNight = theme === 'night';

  return (
    <section className={`py-32 px-6 relative overflow-hidden transition-colors duration-700 ${isNight ? 'bg-[#050505]' : 'bg-white'}`}>
      <img 
        src={isNight ? "https://picsum.photos/seed/cyber-city/1920/1080?grayscale&blur=5&contrast=150" : "https://picsum.photos/seed/office-cinematic/1920/1080?grayscale&blur=2"} 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none"
        referrerPolicy="no-referrer"
      />
      <div className="container mx-auto relative z-10">
        <h3 className={`text-2xl md:text-4xl mb-16 text-center transition-colors ${isNight ? 'text-fuchsia-500 font-night uppercase tracking-[0.1em] md:tracking-[0.3em] drop-shadow-[0_0_10px_rgba(217,70,239,0.4)]' : 'text-black font-serif'}`}>Trayectoria Profesional</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {experiences.map((exp, i) => (
            <Reveal key={i} className="h-full">
              <motion.div
                whileHover={{ 
                  scaleX: 1.05,
                  backgroundColor: isNight ? "#2a0033" : "#D4AF37",
                  borderColor: isNight ? "#d946ef" : "#D4AF37",
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
                className={`p-10 rounded-xl h-full flex flex-col group transition-all duration-300 ${isNight ? 'bg-fuchsia-500/[0.02] border border-fuchsia-500/10' : 'glass-card'}`}
              >
                <div className="flex flex-col mb-6 gap-2">
                  <div className="flex justify-between items-start">
                    <h4 className={`text-3xl transition-colors ${isNight ? 'text-fuchsia-400 font-night group-hover:text-white' : 'text-gold font-serif group-hover:text-black'}`}>{exp.name}</h4>
                    <span className={`text-[10px] border px-3 py-1 rounded-full whitespace-nowrap transition-colors ${isNight ? 'border-fuchsia-500/30 text-fuchsia-400 group-hover:text-white group-hover:border-white/30' : 'border-gold/30 text-gold group-hover:text-black group-hover:border-black/30'}`}>
                      {exp.tag}
                    </span>
                  </div>
                  <p className={`text-xs uppercase tracking-widest font-semibold italic transition-colors ${isNight ? 'text-fuchsia-300/20 group-hover:text-white/60' : 'text-white/40 group-hover:text-black/60'}`}>
                    Producto: {exp.product}
                  </p>
                </div>
                <p className={`leading-relaxed text-sm transition-colors ${isNight ? 'text-fuchsia-100/40 font-night group-hover:text-white' : 'text-gray-400 group-hover:text-black'}`}>
                  {exp.description}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyMe = ({ theme }: { theme: ThemeMode }) => {
  const isNight = theme === 'night';
  const photos = [
    "https://lh3.googleusercontent.com/d/1MNHeRo3XwoN4mKE_WkUO_fNSQ0uMCohC",
    "https://lh3.googleusercontent.com/d/1tVJAJweuJ2ACm2bE_Wc1rRtOwHV_NHwj",
    "https://lh3.googleusercontent.com/d/1h7dzgvPK5EA-3LEdy2Hht5PQXPAZr0kf",
  ];

  return (
    <section className={`py-32 transition-all duration-1000 relative overflow-hidden ${isNight ? 'bg-[#000000] text-white' : 'bg-dark-bg text-white'}`}>
      <img 
        src={isNight ? "https://picsum.photos/seed/cyberpunk-city/1920/1080?grayscale&contrast=150" : "https://picsum.photos/seed/abstract-cinematic/1920/1080?grayscale"} 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover opacity-5 pointer-events-none"
        referrerPolicy="no-referrer"
      />
      <div className="container mx-auto px-6 relative z-10">
        <div className={`flex flex-col ${isNight ? 'md:flex-row-reverse items-start' : 'md:flex-row items-center'} gap-12`}>
          <Reveal className="flex-1 w-full">
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {photos.map((src, i) => (
                <motion.div
                  key={i}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: isNight ? "0 0 60px rgba(217, 70, 239, 0.4)" : "0 0 40px rgba(212, 175, 55, 0.4)"
                  }}
                  className={`rounded-2xl overflow-hidden border transition-all duration-500 ${isNight ? 'border-fuchsia-500/10 contrast-110' : 'border-gold/20'} ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-[3/4]'}`}
                >
                  <img 
                    src={src} 
                    alt={`Mauricio Moreira ${i}`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
          </Reveal>
          
          <div className={`flex-1 ${isNight ? 'text-left' : 'text-center md:text-left'}`}>
            <h3 className={`tracking-widest uppercase text-2xl md:text-4xl mb-8 transition-colors ${isNight ? 'font-night text-fuchsia-500 bg-fuchsia-500/5 inline-block px-6 py-2' : 'text-gold font-serif'}`}>
              ¿Por qué un closer como yo?
            </h3>
            <Reveal>
              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  textShadow: isNight ? "0 0 12px rgba(217, 70, 239, 0.4)" : "0 0 8px rgba(212, 175, 55, 0.3)",
                }}
                className={`rounded-2xl transition-all duration-500 border border-transparent p-8 ${isNight ? 'hover:bg-fuchsia-500/5 hover:border-fuchsia-500/10' : 'hover:bg-gold/5 hover:border-gold/10'}`}
              >
                <p className={`text-2xl md:text-4xl leading-tight mb-8 transition-colors ${isNight ? 'font-night text-white uppercase tracking-tighter font-bold' : 'font-serif italic'}`}>
                  "Vengo de un trasfondo de años donde se unieron el cine, la ingeniería y el diseño que me permitieron tener una visión mas PROFUNDA de las ventas, por eso no soy un closer mas. No sigo guiones de rutina; utilizo esa experiencia para entender profundamente a la persona detrás del prospecto."
                </p>
                <div className={`h-1 mb-8 transition-colors ${isNight ? 'bg-fuchsia-500 w-full shadow-[0_0_20px_rgba(217,70,239,0.8)]' : 'bg-gold w-20'}`} />
                <p className={`text-lg leading-relaxed transition-colors ${isNight ? 'text-fuchsia-100/40 font-night' : 'text-gray-400'}`}>
                  No se trata de vender una historia, testimonios o garantías. Se trata de entender que el cliente compra una <span className={`${isNight ? 'text-fuchsia-400' : 'text-white'} font-semibold`}>forma de sentir</span>. Ese nivel de conciencia es el que traigo a cada llamada.
                </p>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

const Approach = ({ theme }: { theme: ThemeMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const titleLetters = "MI ENFOQUE".split("");
  const isNight = theme === 'night';

  return (
    <section 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`py-32 px-6 relative overflow-hidden transition-all duration-1000 ${isHovered ? (isNight ? 'bg-[#000000]' : 'bg-black') : (isNight ? 'bg-[#050505]' : 'bg-plomo-fondo')}`}
    >
      <motion.img 
        src={isNight ? "https://picsum.photos/seed/vision-dark/1920/1080?grayscale&contrast=100" : "https://picsum.photos/seed/telescope-vision/1920/1080?grayscale"} 
        alt="Visión a largo plazo" 
        animate={{ 
          opacity: isHovered ? 0.3 : 0.05,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        referrerPolicy="no-referrer"
      />
      
      {/* Neon Glow Effects */}
      {isHovered && (
        <>
          <div className={`absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent ${isNight ? 'via-fuchsia-500/40' : 'via-gold/40'} to-transparent blur-sm`} />
          <div className={`absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent ${isNight ? 'via-fuchsia-500/40' : 'via-gold/40'} to-transparent blur-sm`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${isNight ? 'bg-fuchsia-500/5' : 'bg-gold/10'} rounded-full blur-[120px]`} />
        </>
      )}

      <div className="container mx-auto max-w-4xl text-center relative z-10 w-full">
        <motion.div
          animate={{ 
            scale: isHovered ? 1.05 : 1,
            textShadow: isHovered ? (isNight ? "0 0 30px rgba(217, 70, 239, 0.6)" : "0 0 30px rgba(212, 175, 55, 0.6), 0 0 50px rgba(212, 175, 55, 0.4)") : "none"
          }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <motion.div 
            animate={{ 
              scale: isHovered ? 1.2 : 1,
              marginBottom: isHovered ? "3rem" : "2rem"
            }}
            className={`flex justify-center flex-wrap ${isNight ? 'gap-x-2 md:gap-x-6' : 'gap-x-2'}`}
          >
            {titleLetters.map((char, i) => (
              <AnimatedLetter 
                key={i} 
                char={char} 
                index={i} 
                theme={theme}
                isGold={!isHovered && !isNight}
                forceColor={isHovered ? "#FFFFFF" : isNight ? "#d946ef" : "#D4AF37"}
                hoverColor={isNight ? "#FFFFFF" : "#D4AF37"}
              />
            ))}
          </motion.div>
          
          <Reveal className="w-full overflow-hidden">
            <p className={`leading-relaxed transition-all duration-700 max-w-full px-4 ${isHovered ? (isNight ? 'text-fuchsia-400 font-night text-3xl uppercase tracking-tighter font-bold drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]' : 'text-white font-mono text-2xl drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]') : (isNight ? 'text-fuchsia-300/40 font-night text-xl' : 'text-gray-800 font-sans font-medium text-2xl')}`}>
              Busco empresas con las que tener una visión a largo plazo que valoren la congruencia y el liderazgo. Mi meta es crecer dentro de la misma y liderar equipos bajo esta visión de trabajo.
            </p>
          </Reveal>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = ({ theme }: { theme: ThemeMode }) => {
  const isNight = theme === 'night';
  return (
    <footer className={`py-16 text-center relative overflow-hidden transition-colors duration-700 ${isNight ? 'bg-[#000000] text-fuchsia-500' : 'bg-dark-bg text-white'}`}>
      <div className="relative z-10">
        <p className={`text-xs md:text-sm tracking-[0.4em] uppercase font-semibold ${isNight ? 'font-night text-fuchsia-400' : 'opacity-60'}`}>
          Mauricio Moreira, closer de ventas 2026
        </p>
      </div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border rounded-full pointer-events-none ${isNight ? 'border-fuchsia-500/10' : 'border-gold/5'}`} />
    </footer>
  );
};

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('normal');

  return (
    <div className={`min-h-screen transition-all duration-1000 ${theme === 'night' ? 'bg-[#050505]' : 'bg-plomo-fondo'}`}>
      <GrainOverlay />
      {theme === 'night' && <ScanlineOverlay />}
      <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />
      
      <Hero theme={theme} />
      <Stats theme={theme} />
      <Trajectory theme={theme} />
      <WhyMe theme={theme} />
      <Approach theme={theme} />
      <Footer theme={theme} />
    </div>
  );
}
