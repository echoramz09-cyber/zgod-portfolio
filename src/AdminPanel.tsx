import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Save, LogIn, Image as ImageIcon, Maximize, AlertCircle, Zap } from 'lucide-react';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

import { PLAYER_DATA } from './constants';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface AdminPanelProps {
  onUpdate: (data: any) => void;
}

export default function AdminPanel({ onUpdate }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State for all editable fields
  const [imageUrl, setImageUrl] = useState('');
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState(-80);
  const [leftLogoUrl, setLeftLogoUrl] = useState('');
  const [leftLogoScale, setLeftLogoScale] = useState(1);
  const [rightLogoUrl, setRightLogoUrl] = useState('');
  const [rightLogoScale, setRightLogoScale] = useState(1);
  
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [handlePrefix, setHandlePrefix] = useState('');
  const [role, setRole] = useState('');
  const [team, setTeam] = useState('');
  const [teamLogo, setTeamLogo] = useState('');
  const [bio, setBio] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [twitchUrl, setTwitchUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeChannelId, setYoutubeChannelId] = useState('');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [stats, setStats] = useState<{label: string, value: string}[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_USER = 'asxramzonfire09';
  const ADMIN_PASS = 'rehanabegum123';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'config', 'player');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setImageUrl(data.imageUrl || '');
          setScale(data.imageScale || 1);
          setOffset(data.textOffset ?? -80);
          setLeftLogoUrl(data.leftLogoUrl || '');
          setLeftLogoScale(data.leftLogoScale || 1);
          setRightLogoUrl(data.rightLogoUrl || '');
          setRightLogoScale(data.rightLogoScale || 1);
          
          setName(data.name || PLAYER_DATA.name);
          setHandle(data.handle || PLAYER_DATA.handle);
          setHandlePrefix(data.handlePrefix || PLAYER_DATA.handlePrefix);
          setRole(data.role || PLAYER_DATA.role);
          setTeam(data.team || PLAYER_DATA.team);
          setTeamLogo(data.teamLogo || PLAYER_DATA.teamLogo);
          setBio(data.bio || PLAYER_DATA.bio);
          setTwitterUrl(data.twitterUrl || PLAYER_DATA.socials[0].url);
          setInstagramUrl(data.instagramUrl || PLAYER_DATA.socials[1].url);
          setTwitchUrl(data.twitchUrl || PLAYER_DATA.socials[2].url);
          setYoutubeUrl(data.youtubeUrl || PLAYER_DATA.socials[3].url);
          setYoutubeChannelId(data.youtubeChannelId || PLAYER_DATA.youtubeChannelId);
          setAchievements(data.achievements || PLAYER_DATA.achievements);
          setStats(data.stats || PLAYER_DATA.stats);

          onUpdate(data);
        }
      } catch (err) {
        console.error("Error fetching config:", err);
      }
    };
    fetchConfig();
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      try {
        await signInAnonymously(auth);
        setIsLoggedIn(true);
      } catch (err) {
        setError('Auth failed. Check connection.');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  const handleFirestoreError = (error: any, operation: OperationType, path: string) => {
    const errorInfo = {
      error: error.message || 'Unknown error',
      operationType: operation,
      path,
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
      }
    };
    console.error('Firestore Error:', JSON.stringify(errorInfo));
    setError(`Error: ${error.message}`);
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const configData = {
        imageUrl,
        imageScale: parseFloat(scale.toString()),
        textOffset: parseFloat(offset.toString()),
        leftLogoUrl,
        leftLogoScale: parseFloat(leftLogoScale.toString()),
        rightLogoUrl,
        rightLogoScale: parseFloat(rightLogoScale.toString()),
        name,
        handle,
        handlePrefix,
        role,
        team,
        teamLogo,
        bio,
        twitterUrl,
        instagramUrl,
        twitchUrl,
        youtubeUrl,
        youtubeChannelId,
        achievements,
        stats,
        updatedAt: serverTimestamp()
      };
      await setDoc(doc(db, 'config', 'player'), configData);
      onUpdate(configData);
      setIsOpen(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'config/player');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[100] w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform"
      >
        <Settings size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 w-full h-full overflow-y-auto relative p-8 md:p-12"
            >
              <div className="max-w-2xl mx-auto">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 text-white/40 hover:text-white z-20"
                >
                  <X size={32} />
                </button>

                {!isLoggedIn ? (
                  <form onSubmit={handleLogin} className="space-y-8 py-20">
                    <div className="text-center mb-12">
                      <h2 className="text-4xl font-black uppercase text-white tracking-widest">Admin Access</h2>
                      <p className="text-white/40 text-lg mt-4">Enter credentials to manage profile</p>
                    </div>
                    
                    <div className="space-y-6">
                      <input 
                        type="text" 
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white text-lg focus:border-gold-500 outline-none transition-colors"
                      />
                      <input 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white text-lg focus:border-gold-500 outline-none transition-colors"
                      />
                    </div>

                    {error && <p className="text-red-500 text-base text-center font-bold">{error}</p>}

                    <button 
                      type="submit"
                      className="w-full gold-gradient py-5 rounded-2xl text-black font-black uppercase tracking-widest flex items-center justify-center gap-3 text-xl"
                    >
                      Login <LogIn size={24} />
                    </button>
                  </form>
                ) : (
                  <div className="space-y-12 py-12">
                    <div className="text-center">
                      <h2 className="text-4xl font-black uppercase text-white tracking-widest">Profile Settings</h2>
                      <p className="text-white/40 text-lg mt-4">Manage all elements of your player profile</p>
                    </div>

                    <div className="space-y-10">
                      {/* Identity Section */}
                      <div className="space-y-8">
                        <h3 className="text-xl font-black uppercase text-white tracking-widest border-l-4 border-gold-500 pl-4">Identity</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">Handle</label>
                            <input type="text" value={handle} onChange={(e) => setHandle(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">Handle Prefix (Small text above handle)</label>
                            <input type="text" value={handlePrefix} onChange={(e) => setHandlePrefix(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">Role</label>
                            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">Bio</label>
                          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500 resize-none" />
                        </div>
                      </div>

                      {/* Layout & Visuals */}
                      <div className="space-y-8">
                        <h3 className="text-xl font-black uppercase text-white tracking-widest border-l-4 border-gold-500 pl-4">Layout & Visuals</h3>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14} /> Player Image URL</label>
                            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500" />
                          </div>
                          <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-gold-500 uppercase tracking-widest flex items-center gap-2"><Maximize size={14} /> Image Scale ({scale})</label>
                              <input type="range" min="0.5" max="2.5" step="0.05" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-gold-500" />
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-gold-500 uppercase tracking-widest flex items-center gap-2"><Maximize size={14} className="rotate-90" /> Text Overlap ({offset}px)</label>
                              <input type="range" min="-300" max="100" step="5" value={offset} onChange={(e) => setOffset(parseFloat(e.target.value))} className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-gold-500" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Logos Section */}
                      <div className="space-y-8">
                        <h3 className="text-xl font-black uppercase text-white tracking-widest border-l-4 border-gold-500 pl-4">Logos</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-6 p-4 bg-white/5 rounded-2xl">
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Left Logo</p>
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">URL</label>
                              <input type="text" value={leftLogoUrl} onChange={(e) => setLeftLogoUrl(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-gold-500" />
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Scale ({leftLogoScale})</label>
                              <input type="range" min="0.1" max="3" step="0.1" value={leftLogoScale} onChange={(e) => setLeftLogoScale(parseFloat(e.target.value))} className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-gold-500" />
                            </div>
                          </div>
                          <div className="space-y-6 p-4 bg-white/5 rounded-2xl">
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Right Logo</p>
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">URL</label>
                              <input type="text" value={rightLogoUrl} onChange={(e) => setRightLogoUrl(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-gold-500" />
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Scale ({rightLogoScale})</label>
                              <input type="range" min="0.1" max="3" step="0.1" value={rightLogoScale} onChange={(e) => setRightLogoScale(parseFloat(e.target.value))} className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-gold-500" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Team Section */}
                      <div className="space-y-8">
                        <h3 className="text-xl font-black uppercase text-white tracking-widest border-l-4 border-gold-500 pl-4">Team</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">Team Name</label>
                            <input type="text" value={team} onChange={(e) => setTeam(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">Team Logo URL</label>
                            <input type="text" value={teamLogo} onChange={(e) => setTeamLogo(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500" />
                          </div>
                        </div>
                      </div>

                      {/* Socials Section */}
                      <div className="space-y-8">
                        <h3 className="text-xl font-black uppercase text-white tracking-widest border-l-4 border-gold-500 pl-4">Socials</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">Twitter URL</label>
                            <input type="text" value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">Instagram URL</label>
                            <input type="text" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">Twitch URL</label>
                            <input type="text" value={twitchUrl} onChange={(e) => setTwitchUrl(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500" />
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">YouTube URL</label>
                            <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500" />
                          </div>
                          <div className="space-y-3 md:col-span-2">
                            <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">YouTube Channel ID (for Live check)</label>
                            <input type="text" value={youtubeChannelId} onChange={(e) => setYoutubeChannelId(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500" />
                          </div>
                        </div>
                      </div>

                      {/* Achievements & Stats */}
                      <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                          <h3 className="text-xl font-black uppercase text-white tracking-widest border-l-4 border-gold-500 pl-4">Achievements</h3>
                          <div className="space-y-4">
                            {achievements.map((ach, idx) => (
                              <div key={idx} className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={ach} 
                                  onChange={(e) => {
                                    const newAch = [...achievements];
                                    newAch[idx] = e.target.value;
                                    setAchievements(newAch);
                                  }}
                                  className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-gold-500"
                                />
                                <button onClick={() => setAchievements(achievements.filter((_, i) => i !== idx))} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl"><X size={18} /></button>
                              </div>
                            ))}
                            <button onClick={() => setAchievements([...achievements, ''])} className="w-full py-2 border border-dashed border-white/20 rounded-xl text-white/40 hover:text-white hover:border-white/40 transition-colors text-sm font-bold uppercase tracking-widest">+ Add Achievement</button>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h3 className="text-xl font-black uppercase text-white tracking-widest border-l-4 border-gold-500 pl-4">Stats</h3>
                          <div className="space-y-4">
                            {stats.map((stat, idx) => (
                              <div key={idx} className="flex gap-2">
                                <input 
                                  type="text" 
                                  placeholder="Label"
                                  value={stat.label} 
                                  onChange={(e) => {
                                    const newStats = [...stats];
                                    newStats[idx].label = e.target.value;
                                    setStats(newStats);
                                  }}
                                  className="w-1/3 bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-gold-500"
                                />
                                <input 
                                  type="text" 
                                  placeholder="Value"
                                  value={stat.value} 
                                  onChange={(e) => {
                                    const newStats = [...stats];
                                    newStats[idx].value = e.target.value;
                                    setStats(newStats);
                                  }}
                                  className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-gold-500"
                                />
                                <button onClick={() => setStats(stats.filter((_, i) => i !== idx))} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl"><X size={18} /></button>
                              </div>
                            ))}
                            <button onClick={() => setStats([...stats, {label: '', value: ''}])} className="w-full py-2 border border-dashed border-white/20 rounded-xl text-white/40 hover:text-white hover:border-white/40 transition-colors text-sm font-bold uppercase tracking-widest">+ Add Stat</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleSave}
                      disabled={loading}
                      className="w-full gold-gradient py-5 rounded-2xl text-black font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 text-xl mt-12"
                    >
                      {loading ? 'Saving...' : 'Save Changes'} <Save size={24} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
