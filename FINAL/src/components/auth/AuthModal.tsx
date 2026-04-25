
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  Globe, 
  TrendingUp, 
  Briefcase,
  ChevronLeft,
  Facebook
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useTranslation } from '../../context/LanguageContext';
import { UserProfile, UserRole } from '../../types';
import { auth, db, handleFirestoreError, OperationType } from '../../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
  setUser: (user: UserProfile | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onNotify, setUser }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT'>('LOGIN');
  const [role, setRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'SIGNUP') {
        if (!role) {
          setError(t('Please select a profile type.', 'Veuillez sélectionner un type de profil.'));
          setIsLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const firebaseUser = userCredential.user;
        const displayName = formData.name || formData.email.split('@')[0].toUpperCase();
        
        await updateProfile(firebaseUser, { displayName });

        const isAdmin = formData.email.toLowerCase() === 'linkyourart@gmail.com' || formData.email.toLowerCase() === 'lequimejeanbaptiste@gmail.com';
        
        const newUser: UserProfile = {
          uid: firebaseUser.uid,
          displayName,
          email: formData.email,
          role: isAdmin ? UserRole.ADMIN : role,
          isPro: isAdmin || role === UserRole.PROFESSIONAL,
          createdAt: new Date().toISOString(),
          usageStats: {
            simulator: 0,
            swipe: 0,
            compare: 0,
            scan: 0,
            talent: 0
          }
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        setUser(newUser);
        onNotify(t('ACCOUNT INITIALIZED', 'COMPTE INITIALISÉ'));
      } else if (mode === 'LOGIN') {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        onNotify(t('AUTHENTICATION SUCCESSFUL', 'AUTHENTIFICATION RÉUSSIE'));
      } else if (mode === 'FORGOT') {
        await sendPasswordResetEmail(auth, formData.email);
        onNotify(t('RESET EMAIL SENT', 'E-MAIL DE RÉINITIALISATION ENVOYÉ'));
        setMode('LOGIN');
      }
      
      onClose();
    } catch (err: any) {
      console.error('Auth Error:', err);
      handleFirestoreError(err, OperationType.WRITE, 'auth');
      setError(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'facebook') => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = providerName === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        const userEmail = firebaseUser.email?.toLowerCase();
        if (userEmail === 'linkyourart@gmail.com' || userEmail === 'lequimejeanbaptiste@gmail.com') {
          userData.role = UserRole.ADMIN;
          userData.isPro = true;
        }
        setUser(userData);
        onNotify(t('WELCOME BACK', 'BON RETOUR'));
        onClose();
      } else {
        // If signing up via social, we still need a role
        if (mode === 'SIGNUP' && role) {
          const userEmail = firebaseUser.email?.toLowerCase();
          const isAdmin = userEmail === 'linkyourart@gmail.com' || userEmail === 'lequimejeanbaptiste@gmail.com';
          
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'USER',
            email: firebaseUser.email || '',
            role: isAdmin ? UserRole.ADMIN : role,
            isPro: isAdmin || role === UserRole.PROFESSIONAL,
            createdAt: new Date().toISOString(),
            usageStats: {
              simulator: 0,
              swipe: 0,
              compare: 0,
              scan: 0,
              talent: 0
            }
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
          onNotify(t('ACCOUNT INITIALIZED', 'COMPTE INITIALISÉ'));
          onClose();
        } else {
          setError(t('Account not found. Please sign up first.', 'Compte non trouvé. Veuillez d\'abord vous inscrire.'));
          setMode('SIGNUP');
          setStep(1);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Social authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: UserRole.CREATOR,
      title: t('Creator Profile', 'Profil Créateur'),
      description: t('Index your rights, finance your projects, and manage your creative IP.', 'Indexez vos droits, financez vos projets et gérez votre PI créative.'),
      icon: User,
      color: 'primary-cyan'
    },
    {
      id: UserRole.INVESTOR,
      title: t('Investor Profile', 'Profil Investisseur'),
      description: t('Access high-yield creative assets and support the global art ecosystem.', 'Accédez à des actifs créatifs à haut rendement et soutenez l\'écosystème artistique mondial.'),
      icon: TrendingUp,
      color: 'accent-gold'
    },
    {
      id: UserRole.PROFESSIONAL,
      title: t('Pro Profile', 'Profil Pro'),
      description: t('Institutional tools for asset valuation, auditing, and registry management.', 'Outils institutionnels pour la valorisation des actifs, l\'audit et la gestion des registres.'),
      icon: Briefcase,
      color: 'accent-purple'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface-dim/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-surface-low border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row min-h-[600px]"
          >
            {/* Left Side: Branding & Info */}
            <div className="md:w-5/12 bg-white/[0.02] p-8 md:p-12 flex flex-col justify-between border-r border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-cyan/5 via-transparent to-accent-purple/5 pointer-events-none" />
              
              <div className="relative z-10 space-y-12">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center">
                    <Logo size={60} color="multi" />
                  </div>
                  <div className="h-10 w-[1px] bg-white/10" />
                  <h2 className="text-2xl font-black font-headline tracking-tighter text-white">LINKYOURART</h2>
                </div>

                <div className="space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary-cyan border-b border-white/5 pb-4">
                    {t('Institutional Access', 'Accès Institutionnel')}
                  </h3>
                  
                  <div className="space-y-6">
                    {roles.map((r) => (
                      <div key={r.id} className="flex gap-4 group">
                        <div className={`w-10 h-10 shrink-0 rounded-xl bg-${r.color}/10 border border-${r.color}/20 flex items-center justify-center text-${r.color}`}>
                          <r.icon size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase italic tracking-tight text-white group-hover:text-primary-cyan transition-colors">{r.title}</h4>
                          <p className="text-[10px] text-on-surface-variant leading-relaxed opacity-60 mt-1">
                            {r.id === UserRole.CREATOR && t('Index your rights, finance your projects, and manage your creative IP with institutional tools.', 'Indexez vos droits, financez vos projets et gérez votre PI créative avec des outils institutionnels.')}
                            {r.id === UserRole.INVESTOR && t('Access high-yield creative assets and support the global art ecosystem with real-time analytics.', 'Accédez à des actifs créatifs à haut rendement et soutenez l\'écosystème artistique mondial avec des analyses en temps réel.')}
                            {r.id === UserRole.PROFESSIONAL && t('Institutional tools for asset valuation, auditing, and registry management for professionals.', 'Outils institutionnels pour la valorisation des actifs, l\'audit et la gestion des registres pour les professionnels.')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-8 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-3 text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  SECURED TERMINAL
                </div>
                <div className="flex items-center gap-3 text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">
                  <Globe size={14} className="text-primary-cyan" />
                  V4.2 ALPHA
                </div>
              </div>
            </div>

            {/* Right Side: Auth Forms */}
            <div className="md:w-7/12 p-8 md:p-12 relative flex flex-col">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-2 text-on-surface-variant hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                <AnimatePresence mode="wait">
                  {mode === 'LOGIN' && (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="space-y-2">
                        <h1 className="text-4xl font-black font-headline uppercase tracking-tighter italic text-white">
                          {t('WELCOME BACK', 'BON RETOUR')}
                        </h1>
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold opacity-60">
                          {t('Access your institutional terminal', 'Accédez à votre terminal institutionnel')}
                        </p>
                      </div>

                      <form onSubmit={handleAuth} className="space-y-4">
                        {error && (
                          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl">
                            {error}
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-cyan transition-colors" size={18} />
                            <input 
                              type="email" 
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:border-primary-cyan focus:bg-white/[0.08] outline-none transition-all"
                              placeholder={t('INSTITUTIONAL EMAIL', 'EMAIL INSTITUTIONNEL')}
                            />
                          </div>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-cyan transition-colors" size={18} />
                            <input 
                              type="password" 
                              required
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:border-primary-cyan focus:bg-white/[0.08] outline-none transition-all"
                              placeholder={t('PASSWORD', 'MOT DE PASSE')}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button 
                            type="button"
                            onClick={() => setMode('FORGOT')}
                            className="text-[10px] font-black uppercase tracking-widest text-primary-cyan hover:text-white transition-colors"
                          >
                            {t('Forgot Password?', 'Mot de passe oublié ?')}
                          </button>
                        </div>

                        <button 
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-4 bg-primary-cyan text-surface-dim font-black uppercase italic tracking-widest hover:bg-white transition-all shadow-[0_20px_40px_rgba(0,224,255,0.2)] rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('Initialize Session', 'Initialiser la Session')} <ArrowRight size={18} /></>}
                        </button>
                      </form>

                      <div className="space-y-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                          </div>
                          <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em] font-black text-on-surface-variant/40">
                            <span className="bg-surface-low px-4">{t('Or connect with', 'Ou se connecter avec')}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <button 
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                          </button>
                          <button 
                            onClick={() => handleSocialLogin('facebook')}
                            className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                          >
                            <Facebook size={16} className="text-[#1877F2]" />
                            Facebook
                          </button>
                        </div>
                      </div>

                      <div className="text-center">
                        <button 
                          onClick={() => { setMode('SIGNUP'); setStep(1); }}
                          className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary-cyan transition-colors"
                        >
                          {t('New to the protocol? Create Account', 'Nouveau sur le protocole ? Créer un Compte')}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {mode === 'SIGNUP' && step === 1 && (
                    <motion.div
                      key="signup-step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="space-y-2">
                        <h1 className="text-4xl font-black font-headline uppercase tracking-tighter italic text-white">
                          {t('SELECT PROFILE', 'CHOISIR PROFIL')}
                        </h1>
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold opacity-60">
                          {t('Choose your role in the ecosystem', 'Choisissez votre rôle dans l\'écosystème')}
                        </p>
                      </div>

                      <div className="space-y-4">
                        {roles.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => {
                              setRole(r.id);
                              setStep(2);
                            }}
                            className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-primary-cyan hover:bg-white/[0.08] transition-all group relative overflow-hidden"
                          >
                            <div className="flex items-center gap-6">
                              <div className={`w-12 h-12 rounded-2xl bg-${r.color}/10 border border-${r.color}/20 flex items-center justify-center text-${r.color} group-hover:scale-110 transition-transform`}>
                                <r.icon size={24} />
                              </div>
                              <div>
                                <h3 className="text-lg font-black uppercase italic tracking-tight text-white">{r.title}</h3>
                                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold opacity-60">{r.description}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="text-center">
                        <button 
                          onClick={() => setMode('LOGIN')}
                          className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary-cyan transition-colors"
                        >
                          {t('Already have an account? Login', 'Déjà inscrit ? Se Connecter')}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {mode === 'SIGNUP' && step === 2 && (
                    <motion.div
                      key="signup-step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <button 
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors"
                      >
                        <ChevronLeft size={14} /> {t('Back to Profiles', 'Retour aux Profils')}
                      </button>

                      <div className="space-y-2">
                        <h1 className="text-4xl font-black font-headline uppercase tracking-tighter italic text-white">
                          {t('WELCOME TO LINKYOURART', 'BIENVENUE SUR LINKYOURART')}
                        </h1>
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold opacity-60">
                          {t('Initialize your institutional profile', 'Initialisez votre profil institutionnel')}
                        </p>
                      </div>

                      <form onSubmit={handleAuth} className="space-y-4">
                        {error && (
                          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl">
                            {error}
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-cyan transition-colors" size={18} />
                            <input 
                              type="text" 
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:border-primary-cyan focus:bg-white/[0.08] outline-none transition-all"
                              placeholder={t('FULL NAME', 'NOM COMPLET')}
                            />
                          </div>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-cyan transition-colors" size={18} />
                            <input 
                              type="email" 
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:border-primary-cyan focus:bg-white/[0.08] outline-none transition-all"
                              placeholder={t('INSTITUTIONAL EMAIL', 'EMAIL INSTITUTIONNEL')}
                            />
                          </div>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-cyan transition-colors" size={18} />
                            <input 
                              type="password" 
                              required
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:border-primary-cyan focus:bg-white/[0.08] outline-none transition-all"
                              placeholder={t('PASSWORD', 'MOT DE PASSE')}
                            />
                          </div>
                        </div>

                        <button 
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-4 bg-primary-cyan text-surface-dim font-black uppercase italic tracking-widest hover:bg-white transition-all shadow-[0_20px_40px_rgba(0,224,255,0.2)] rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('Create Account', 'Créer le Compte')} <ArrowRight size={18} /></>}
                        </button>
                      </form>

                      <div className="space-y-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                          </div>
                          <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em] font-black text-on-surface-variant/40">
                            <span className="bg-surface-low px-4">{t('Or connect with', 'Ou se connecter avec')}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <button 
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                          </button>
                          <button 
                            onClick={() => handleSocialLogin('facebook')}
                            className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                          >
                            <Facebook size={16} className="text-[#1877F2]" />
                            Facebook
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {mode === 'FORGOT' && (
                    <motion.div
                      key="forgot"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="space-y-2">
                        <h1 className="text-4xl font-black font-headline uppercase tracking-tighter italic text-white">
                          {t('RESET ACCESS', 'RÉINITIALISER')}
                        </h1>
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold opacity-60">
                          {t('Enter your email to receive reset instructions', 'Entrez votre email pour réinitialiser')}
                        </p>
                      </div>

                      <form onSubmit={handleAuth} className="space-y-4">
                        {error && (
                          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl">
                            {error}
                          </div>
                        )}
                        
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-cyan transition-colors" size={18} />
                          <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:border-primary-cyan focus:bg-white/[0.08] outline-none transition-all"
                            placeholder={t('INSTITUTIONAL EMAIL', 'EMAIL INSTITUTIONNEL')}
                          />
                        </div>

                        <button 
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-4 bg-primary-cyan text-surface-dim font-black uppercase italic tracking-widest hover:bg-white transition-all shadow-[0_20px_40px_rgba(0,224,255,0.2)] rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('Send Reset Link', 'Envoyer le Lien')} <ArrowRight size={18} /></>}
                        </button>
                      </form>

                      <div className="text-center">
                        <button 
                          onClick={() => setMode('LOGIN')}
                          className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary-cyan transition-colors"
                        >
                          {t('Back to Login', 'Retour à la Connexion')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
