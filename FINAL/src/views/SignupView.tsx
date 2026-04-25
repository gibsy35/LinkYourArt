import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, UserProfile } from '../types';
import { View } from '../components/ui/Sidebar';
import { ArrowRight, User, Briefcase, TrendingUp, Loader2, ShieldCheck, Mail, Lock, Globe, ChevronLeft } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Logo } from '../components/ui/Logo';

interface SignupViewProps {
  onViewChange: (view: View) => void;
  setUser: (user: UserProfile) => void;
}

const SignupView: React.FC<SignupViewProps> = ({ onViewChange, setUser }) => {
  const { t } = useTranslation();
  const [role, setRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !formData.name || !formData.email || !formData.password) return;

    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: formData.name });

      const newUser: UserProfile = {
        uid: firebaseUser.uid,
        displayName: formData.name,
        email: formData.email,
        role: role,
        createdAt: new Date().toISOString(),
        twitter: '@' + formData.name.toLowerCase().replace(/\s+/g, '_'),
        instagram: formData.name.toLowerCase().replace(/\s+/g, '_') + '_official',
        linkedin: 'https://linkedin.com/in/' + formData.name.toLowerCase().replace(/\s+/g, '-'),
        usageStats: {
          simulator: 0,
          swipe: 0,
          compare: 0,
          scan: 0,
          talent: 0
        }
      };

      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      } catch (err: any) {
        handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
        return;
      }
      
      try {
        await sendEmailVerification(firebaseUser);
        setIsVerificationSent(true);
      } catch (verifyErr) {
        console.error('Error sending verification email:', verifyErr);
        setUser(newUser);
        onViewChange('PROFILE');
      }
    } catch (err: any) {
      console.error('Signup Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError(t(
          'This email is already registered. Please login.',
          'Cet e-mail est déjà enregistré. Veuillez vous connecter.'
        ));
      } else if (err.code === 'auth/weak-password') {
        setError(t(
          'Password must be at least 6 characters.',
          'Le mot de passe doit comporter au moins 6 caractères.'
        ));
      } else {
        setError(err.message || 'Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!role) return;
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      let userDoc;
      try {
        userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      } catch (err: any) {
        handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
        return;
      }
      
      if (userDoc.exists()) {
        const existingUser = userDoc.data() as UserProfile;
        setUser(existingUser);
        onViewChange('PROFILE');
      } else {
        const newUser: UserProfile = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          role: role,
          createdAt: new Date().toISOString(),
          twitter: '@' + (firebaseUser.displayName || 'user').toLowerCase().replace(/\s+/g, '_'),
          instagram: (firebaseUser.displayName || 'user').toLowerCase().replace(/\s+/g, '_') + '_official',
          linkedin: 'https://linkedin.com/in/' + (firebaseUser.displayName || 'user').toLowerCase().replace(/\s+/g, '-'),
          usageStats: {
            simulator: 0,
            swipe: 0,
            compare: 0,
            scan: 0,
            talent: 0
          }
        };

        try {
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        } catch (err: any) {
          handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
          return;
        }
        setUser(newUser);
        onViewChange('PROFILE');
      }
    } catch (err: any) {
      setError(err.message || 'Google signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: UserRole.CREATOR,
      title: t('Creator', 'Créateur'),
      description: t('Index your rights and finance your projects.', 'Indexez vos droits et financez vos projets.'),
      icon: User,
      color: 'primary-cyan'
    },
    {
      id: UserRole.INVESTOR,
      title: t('Investor', 'Investisseur'),
      description: t('Support creation and participate in asset valuation.', 'Soutenez la création et participez à la valorisation.'),
      icon: TrendingUp,
      color: 'accent-gold'
    },
    {
      id: UserRole.PROFESSIONAL,
      title: t('Professional', 'Professionnel'),
      description: t('Evaluate projects and manage institutional assets.', 'Évaluez les projets et gérez les actifs.'),
      icon: Briefcase,
      color: 'accent-purple'
    }
  ];

  if (isVerificationSent) {
    return (
      <div className="min-h-screen bg-surface-dim text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-surface-low/40 backdrop-blur-3xl border border-white/10 p-12 text-center space-y-8 rounded-[2.5rem]"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 rounded-3xl">
              <ShieldCheck size={40} />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black font-headline uppercase tracking-tighter italic">{t('Verify Email', 'Vérifiez E-mail')}</h2>
            <p className="text-on-surface-variant text-xs leading-relaxed opacity-70 uppercase tracking-widest font-bold">
              {t('A verification link has been sent. Please check your inbox to complete registration.', 'Un lien de vérification a été envoyé. Veuillez vérifier votre boîte de réception.')}
            </p>
          </div>
          <button 
            onClick={() => onViewChange('LOGIN')}
            className="w-full py-4 bg-primary-cyan text-surface-dim font-black text-xs uppercase tracking-widest shadow-[0_20px_40px_rgba(0,224,255,0.2)] hover:bg-white transition-all rounded-2xl"
          >
            {t('Proceed to Login', 'Procéder à la Connexion')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dim text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-cyan/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-purple/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-low/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Side: Branding */}
            <div className="md:w-2/5 bg-white/[0.03] p-10 flex flex-col justify-between border-r border-white/5">
              <div className="space-y-6">
                <Logo size={60} color="multi" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-black font-headline uppercase tracking-tighter italic leading-tight">
                    Join<br /><span className="text-primary-cyan">The</span><br />Network
                  </h2>
                  <div className="h-1 w-12 bg-primary-cyan rounded-full" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-50">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  MICA COMPLIANT
                </div>
                <div className="flex items-center gap-3 text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-50">
                  <Globe size={14} className="text-primary-cyan" />
                  INSTITUTIONAL GRADE
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="md:w-3/5 p-10 md:p-12">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-10">
                      <h1 className="text-3xl md:text-5xl font-black font-headline tracking-tighter text-white leading-[0.9] uppercase italic mb-10 flex items-center gap-4">
                        <div className="h-[2px] w-12 bg-primary-cyan"></div>
                        <span>{t('Select Profile', 'Profil')}</span>
                      </h1>
                      <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold opacity-60 ml-16">
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
                              <h3 className="text-lg font-black uppercase italic tracking-tight">{r.title}</h3>
                              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold opacity-60">{r.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-10 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                        {t('Already registered?', 'Déjà inscrit ?')}{' '}
                        <button 
                          onClick={() => onViewChange('LOGIN')}
                          className="text-primary-cyan hover:text-white transition-colors ml-2"
                        >
                          {t('Login Here', 'Se Connecter')}
                        </button>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <button 
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors mb-8"
                    >
                      <ChevronLeft size={14} /> {t('Back to Profiles', 'Retour aux Profils')}
                    </button>

                    <div className="mb-10">
                      <h1 className="text-3xl md:text-5xl font-black font-headline tracking-tighter text-white leading-[0.9] uppercase italic mb-10 flex items-center gap-4">
                        <div className="h-[2px] w-12 bg-primary-cyan"></div>
                        <span>{t('Create Account', 'Inscription')}</span>
                      </h1>
                      <div className="flex items-center gap-2 ml-16">
                        <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold opacity-60">
                          {t('Registering as', 'Inscription en tant que')}
                        </span>
                        <span className="px-2 py-0.5 bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/20 rounded text-[10px] font-black uppercase tracking-widest">
                          {role}
                        </span>
                      </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSignup}>
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
                            disabled={isLoading}
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
                            disabled={isLoading}
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
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-primary-cyan text-surface-dim font-black uppercase italic tracking-widest hover:bg-white transition-all active:scale-95 shadow-[0_20px_40px_rgba(0,224,255,0.2)] rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('Create Account', 'Créer le Compte')} <ArrowRight size={18} /></>}
                      </button>

                      <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em] font-black text-on-surface-variant/40">
                          <span className="bg-surface-low/40 px-4">{t('Or', 'Ou')}</span>
                        </div>
                      </div>

                      <button 
                        type="button"
                        onClick={handleGoogleSignup}
                        disabled={isLoading}
                        className="w-full py-4 bg-white/5 border border-white/10 text-white font-black uppercase italic tracking-widest hover:bg-white/10 transition-all rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {t('Google Access', 'Accès Google')}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupView;
