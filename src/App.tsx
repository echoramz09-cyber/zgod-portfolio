import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Twitter, 
  Instagram, 
  Youtube, 
  Twitch, 
  Trophy, 
  Target, 
  Users, 
  ExternalLink,
  Play,
  ChevronRight,
  Gamepad2,
  Zap
} from "lucide-react";
import { PLAYER_DATA } from "./constants";
import AdminPanel from "./AdminPanel";
import { db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";

const IconMap: Record<string, any> = {
  Twitter,
  Instagram,
  Youtube,
  Twitch,
};

export default function App() {
  const [playerImage, setPlayerImage] = useState(PLAYER_DATA.image);
  const [playerScale, setPlayerScale] = useState(PLAYER_DATA.imageScale);
  const [textOffset, setTextOffset] = useState(PLAYER_DATA.textOffset);
  const [leftLogo, setLeftLogo] = useState({ url: PLAYER_DATA.leftLogoUrl, scale: PLAYER_DATA.leftLogoScale });
  const [rightLogo, setRightLogo] = useState({ url: PLAYER_DATA.rightLogoUrl, scale: PLAYER_DATA.rightLogoScale });

  useEffect(() => {
    // Real-time listener for player config
    const unsub = onSnapshot(doc(db, "config", "player"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setPlayerImage(data.imageUrl || "");
        setPlayerScale(data.imageScale || 1);
        setTextOffset(data.textOffset ?? -80);
        setLeftLogo({ url: data.leftLogoUrl || "", scale: data.leftLogoScale || 1 });
        setRightLogo({ url: data.rightLogoUrl || "", scale: data.rightLogoScale || 1 });
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-black selection:bg-gold-500 selection:text-black relative overflow-x-hidden">
      {/* Top Logos */}
      <div className="fixed top-0 inset-x-0 z-50 flex justify-between items-start p-4 md:p-6 pointer-events-none overflow-hidden">
        <div className="transition-all duration-300 max-w-[40%]">
          {leftLogo.url && (
            <img 
              src={leftLogo.url} 
              alt="Left Logo" 
              style={{ transform: `scale(${leftLogo.scale})`, transformOrigin: 'top left' }}
              className="h-10 md:h-16 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
        <div className="transition-all duration-300 max-w-[40%]">
          {rightLogo.url && (
            <img 
              src={rightLogo.url} 
              alt="Right Logo" 
              style={{ transform: `scale(${rightLogo.scale})`, transformOrigin: 'top right' }}
              className="h-10 md:h-16 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
      </div>
      {/* Background Elements - Enhanced Visibility */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black/70 z-10" /> {/* Dark Overlay */}
        <img 
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
          alt="Gaming Background" 
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        
        {/* Large Radial Glows for Depth */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gold-600/20 blur-[150px] rounded-full opacity-40 z-20" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-gold-500/15 blur-[150px] rounded-full opacity-40 z-20" />
        
        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-repeat z-30" />
      </div>

      <AdminPanel onUpdate={(data) => {
        setPlayerImage(data.imageUrl);
        setPlayerScale(data.scale);
        setTextOffset(data.offset);
        setLeftLogo({ url: data.leftLogoUrl, scale: data.leftLogoScale });
        setRightLogo({ url: data.rightLogoUrl, scale: data.rightLogoScale });
      }} />

      {/* Hero Section - Dynamic Layout based on Scale */}
      <section className="relative z-10 min-h-screen flex flex-col items-center pt-10 pb-12 md:pb-20">
        {/* Vertical Player Image Container */}
        <div 
          className="relative w-full max-w-4xl flex items-center justify-center transition-all duration-500 ease-out"
          style={{ height: `${45 * playerScale}vh` }}
        >
          <AnimatePresence mode="wait">
            {playerImage ? (
              <motion.div
                key={playerImage}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative h-full w-full flex justify-center"
              >
                <img 
                  src={playerImage} 
                  alt={PLAYER_DATA.name}
                  style={{ transform: `scale(${playerScale})`, transformOrigin: 'top center' }}
                  className="h-full w-auto object-contain object-top mask-image-b drop-shadow-[0_0_50px_rgba(251,191,36,0.3)] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ) : (
              <div className="w-full h-full max-w-4xl border-x border-dashed border-white/5 flex items-center justify-center">
                <span className="text-white/5 font-black text-4xl uppercase tracking-[1em] rotate-90 select-none">
                  Add Image in Admin Panel
                </span>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Details Section - Overlapping the bottom of the image dynamically */}
        <div 
          className="relative z-20 w-full max-w-7xl mx-auto px-6 transition-all duration-300"
          style={{ marginTop: `${textOffset}px` }}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center text-center"
          >
            <h1 className="text-3xl md:text-5xl font-black uppercase leading-[0.8] mb-4 tracking-tighter gold-text-gradient drop-shadow-[0_0_80px_rgba(0,0,0,0.8)]">
              {PLAYER_DATA.handle}
            </h1>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-12">
              <div className="flex items-center gap-3 text-2xl font-bold text-white/90 uppercase tracking-tight">
                <Gamepad2 className="text-gold-500" size={28} />
                {PLAYER_DATA.role}
              </div>
              <div className="hidden md:block w-px h-8 bg-white/20" />
              <div className="flex items-center gap-3 text-2xl font-bold text-white/90 uppercase tracking-tight">
                <Trophy className="text-gold-500" size={28} />
                World Champion
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-8 items-center">
              <span className="text-gold-500 text-xs font-black uppercase tracking-[0.3em] opacity-60">
                Socials
              </span>
              <div className="flex items-center gap-3">
                {PLAYER_DATA.socials.map((social) => {
                  const Icon = IconMap[social.icon];
                  return (
                    <a 
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-white/60 hover:text-gold-400 hover:border-gold-500/50 hover:bg-gold-500/5 transition-all bg-white/5 backdrop-blur-sm"
                    >
                      <Icon size={24} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Made Transparent */}
      <section id="stats" className="relative z-10 py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {PLAYER_DATA.stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md gold-glow relative group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Target className="text-gold-500/20" size={40} />
                </div>
                <div className="text-gold-500 text-sm font-bold uppercase tracking-widest mb-2">{stat.label}</div>
                <div className="text-5xl font-black text-white tracking-tighter">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team & Achievements - Made Transparent */}
      <section id="achievements" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Team Info */}
            <div>
              <h2 className="text-4xl font-black uppercase mb-12 flex items-center gap-4">
                <span className="w-12 h-1 bg-gold-500" />
                Current Team
              </h2>
              <div className="p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-center gap-10">
                <div className="w-40 h-40 rounded-2xl overflow-hidden gold-border p-2 bg-black">
                  <img 
                    src={PLAYER_DATA.teamLogo} 
                    alt={PLAYER_DATA.team} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-black text-white mb-2 uppercase">{PLAYER_DATA.team}</h3>
                  <p className="text-gold-400 font-bold uppercase tracking-widest mb-6">Tier 1 Organization</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-4 py-2 bg-white/5 rounded-lg text-xs font-bold uppercase tracking-wider text-white/60">Active Roster</span>
                    <span className="px-4 py-2 bg-white/5 rounded-lg text-xs font-bold uppercase tracking-wider text-white/60">Global Rank #3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-4xl font-black uppercase mb-12 flex items-center gap-4">
                <span className="w-12 h-1 bg-gold-500" />
                Hall of Fame
              </h2>
              <div className="space-y-4">
                {PLAYER_DATA.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-gold-500/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 group-hover:scale-110 transition-transform">
                      <Trophy size={24} />
                    </div>
                    <span className="text-lg font-bold text-white/80 group-hover:text-white transition-colors">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Section - Made Transparent */}
      <section id="youtube" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-5xl font-black uppercase mb-6">Latest Content</h2>
              <p className="text-gray-400 text-lg">
                Check out my latest highlights, tutorials, and behind-the-scenes content on YouTube.
              </p>
            </div>
            <a 
              href={`https://youtube.com/channel/${PLAYER_DATA.youtubeChannelId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gold-500 font-black uppercase tracking-widest hover:text-gold-400 transition-colors group"
            >
              Visit Channel <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video rounded-2xl overflow-hidden relative mb-6 gold-border">
                  <img 
                    src={`https://picsum.photos/seed/yt${i}/800/450`} 
                    alt="Video Thumbnail" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center">
                      <Play size={24} className="fill-black text-black ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/80 text-[10px] font-bold text-white rounded">
                    12:45
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
                  How to Master {PLAYER_DATA.role} in 2026
                </h3>
                <div className="flex items-center gap-4 text-white/40 text-sm font-medium">
                  <span>1.2M Views</span>
                  <span>•</span>
                  <span>2 days ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-20 border-t border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 gold-gradient rounded flex items-center justify-center">
                <Zap className="text-black fill-black" size={18} />
              </div>
              <span className="text-lg font-black tracking-tighter gold-text-gradient uppercase">
                {PLAYER_DATA.handle}
              </span>
            </div>
            
            <div className="flex items-center gap-8">
              {PLAYER_DATA.socials.map((social) => {
                const Icon = IconMap[social.icon];
                return (
                  <a 
                    key={social.platform}
                    href={social.url}
                    className="text-white/40 hover:text-gold-400 transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>

            <p className="text-white/20 text-sm font-medium">
              © 2026 {PLAYER_DATA.handle}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
