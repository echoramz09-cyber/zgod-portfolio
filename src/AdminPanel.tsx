import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Save, LogIn, Image as ImageIcon, Maximize, AlertCircle, Zap } from 'lucide-react';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface AdminPanelProps {
  onUpdate: (data: {
    imageUrl: string;
    scale: number;
    offset: number;
    leftLogoUrl: string;
    leftLogoScale: number;
    rightLogoUrl: string;
    rightLogoScale: number;
  }) => void;
}

export default function AdminPanel({ onUpdate }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState(-80);
  const [leftLogoUrl, setLeftLogoUrl] = useState('');
  const [leftLogoScale, setLeftLogoScale] = useState(1);
  const [rightLogoUrl, setRightLogoUrl] = useState('');
  const [rightLogoScale, setRightLogoScale] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_USER = 'asxramzonfire09';
  const ADMIN_PASS = 'rehanabegum123';

  useEffect(() => {
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
          onUpdate({
            imageUrl: data.imageUrl || '',
            scale: data.imageScale || 1,
            offset: data.textOffset ?? -80,
            leftLogoUrl: data.leftLogoUrl || '',
            leftLogoScale: data.leftLogoScale || 1,
            rightLogoUrl: data.rightLogoUrl || '',
            rightLogoScale: data.rightLogoScale || 1,
          });
        }
      } catch (err) {
        console.error("Error fetching config:", err);
      }
    };
    fetchConfig();
  }, []);

  const handleFirestoreError = (error: any, operationType: OperationType, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    setError(`Permission Denied: ${errInfo.error}`);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      try {
        setLoading(true);
        // Sign in anonymously to Firebase so the security rules allow the write
        await signInAnonymously(auth);
        setIsLoggedIn(true);
        setError('');
      } catch (err) {
        console.error("Auth error:", err);
        setError("Failed to initialize secure session.");
      } finally {
        setLoading(false);
      }
    } else {
      setError('Invalid credentials');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    const path = 'config/player';
    try {
      await setDoc(doc(db, 'config', 'player'), {
        imageUrl,
        imageScale: parseFloat(scale.toString()),
        textOffset: parseFloat(offset.toString()),
        leftLogoUrl,
        leftLogoScale: parseFloat(leftLogoScale.toString()),
        rightLogoUrl,
        rightLogoScale: parseFloat(rightLogoScale.toString()),
        updatedAt: serverTimestamp()
      });
      onUpdate({
        imageUrl,
        scale,
        offset,
        leftLogoUrl,
        leftLogoScale,
        rightLogoUrl,
        rightLogoScale
      });
      setIsOpen(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-md relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X size={24} />
              </button>

              {!isLoggedIn ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-black uppercase text-white tracking-widest">Admin Access</h2>
                    <p className="text-white/40 text-sm mt-2">Enter credentials to manage profile</p>
                  </div>
                  
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none transition-colors"
                    />
                    <input 
                      type="password" 
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none transition-colors"
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

                  <button 
                    type="submit"
                    className="w-full gold-gradient py-4 rounded-xl text-black font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Login <LogIn size={20} />
                  </button>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-black uppercase text-white tracking-widest">Profile Settings</h2>
                    <p className="text-white/40 text-sm mt-2">Manage your vertical image and scale</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gold-500 uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon size={14} /> Image URL
                      </label>
                      <input 
                        type="text" 
                        placeholder="https://..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold-500 outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gold-500 uppercase tracking-widest flex items-center gap-2">
                        <Maximize size={14} /> Image Scale ({scale})
                      </label>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="2.5" 
                        step="0.05"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-full accent-gold-500"
                      />
                      <div className="flex justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest">
                        <span>Small</span>
                        <span>Normal</span>
                        <span>Large</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gold-500 uppercase tracking-widest flex items-center gap-2">
                        <Maximize size={14} className="rotate-90" /> Text Overlap ({offset}px)
                      </label>
                      <input 
                        type="range" 
                        min="-300" 
                        max="100" 
                        step="5"
                        value={offset}
                        onChange={(e) => setOffset(parseFloat(e.target.value))}
                        className="w-full accent-gold-500"
                      />
                      <div className="flex justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest">
                        <span>High Overlap</span>
                        <span>No Overlap</span>
                        <span>Below Image</span>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-6 space-y-6">
                      <h3 className="text-sm font-black uppercase text-white tracking-widest">Top Logos</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Left Logo URL</label>
                          <input 
                            type="text" 
                            placeholder="https://..."
                            value={leftLogoUrl}
                            onChange={(e) => setLeftLogoUrl(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-gold-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Left Logo Scale ({leftLogoScale})</label>
                          <input 
                            type="range" min="0.1" max="3" step="0.1"
                            value={leftLogoScale}
                            onChange={(e) => setLeftLogoScale(parseFloat(e.target.value))}
                            className="w-full accent-gold-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Right Logo URL</label>
                          <input 
                            type="text" 
                            placeholder="https://..."
                            value={rightLogoUrl}
                            onChange={(e) => setRightLogoUrl(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-gold-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Right Logo Scale ({rightLogoScale})</label>
                          <input 
                            type="range" min="0.1" max="3" step="0.1"
                            value={rightLogoScale}
                            onChange={(e) => setRightLogoScale(parseFloat(e.target.value))}
                            className="w-full accent-gold-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full gold-gradient py-4 rounded-xl text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'} <Save size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
