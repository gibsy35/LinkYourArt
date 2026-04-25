
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Upload, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Award, 
  FileText, 
  CheckCircle2,
  Info,
  DollarSign,
  Sparkles,
  Image as ImageIcon,
  TrendingUp,
  Calendar,
  Lock
} from 'lucide-react';
import { LYA_UNIT_VALUE, Milestone, UserProfile, UserRole } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { suggestMilestones } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";

interface Step {
  id: number;
  title: string;
  description: string;
}

export const LinkArtView: React.FC<{ 
  user: UserProfile | null;
  onNotify: (msg: string) => void;
}> = ({ user, onNotify }) => {
  const { t } = useTranslation();

  // Access Control: Only Admin or Pro users can issue new contracts
  if (user?.role !== UserRole.ADMIN && !user?.isPro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
        >
          <Lock size={48} className="text-red-500" />
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-black font-headline uppercase italic text-on-surface mb-6 tracking-tighter">
          {t('Access Restricted', 'Accès Restreint')}
        </h2>
        <p className="text-on-surface-variant max-w-lg mb-10 text-sm md:text-base leading-relaxed opacity-70">
          {t('Contract Issuance is reserved for Certified Professionals and Institutional Partners. Upgrade your account to start fractionalizing your creative equity.', 'L\'émission de contrats est réservée aux professionnels certifiés et aux partenaires institutionnels. Améliorez votre compte pour commencer à fractionner votre capital créatif.')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => onNotify(t('Redirecting to membership plans...', 'Redirection vers les plans d\'adhésion...'))}
            className="px-10 py-4 bg-primary-cyan text-surface-dim font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_20px_rgba(0,224,255,0.3)]"
          >
            {t('Upgrade to Pro', 'Passer à Pro')}
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-white/5 border border-white/10 text-on-surface font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
          >
            {t('Contact Support', 'Contacter le Support')}
          </button>
        </div>
      </div>
    );
  }

  const { formatLYA, formatPrice } = useCurrency();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalUnits, setTotalUnits] = useState(1000);
  const [unitPrice, setUnitPrice] = useState(100);
  const [depositPercentage, setDepositPercentage] = useState(10);
  const [contractDuration, setContractDuration] = useState('12');
  const [maturityDate, setMaturityDate] = useState('2027-03-29');
  const [assetName, setAssetName] = useState('');
  const [issuerName, setIssuerName] = useState('');
  const [description, setDescription] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isSuggestingMilestones, setIsSuggestingMilestones] = useState(false);

  const handleSuggestMilestones = async () => {
    if (!description) {
      onNotify(t('Please provide a project description to suggest milestones.', 'Veuillez fournir une description de projet pour suggérer des jalons.'));
      return;
    }

    setIsSuggestingMilestones(true);
    onNotify(t('AI IS ANALYZING PROJECT TIMELINE...', 'L\'IA ANALYSE LE CALENDRIER DU PROJET...'));

    try {
      const suggestions = await suggestMilestones(description);
      const formattedMilestones: Milestone[] = suggestions.map((s: any) => ({
        label: s.label,
        date: s.date,
        status: 'UPCOMING',
        priceImpact: s.priceImpact
      }));
      setMilestones(formattedMilestones);
      onNotify(t('MILESTONES SUGGESTED SUCCESSFULLY.', 'JALONS SUGGÉRÉS AVEC SUCCÈS.'));
    } catch (error) {
      console.error('Milestone suggestion failed:', error);
      onNotify(t('FAILED TO SUGGEST MILESTONES.', 'ÉCHEC DE LA SUGGESTION DES JALONS.'));
    } finally {
      setIsSuggestingMilestones(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!description) {
      onNotify(t('Please provide a description first.', 'Veuillez d\'abord fournir une description.'));
      return;
    }

    setIsGeneratingImage(true);
    onNotify(t('GENERATING CONTRACT VISUALIZATION...', 'GÉNÉRATION DE LA VISUALISATION DU CONTRAT...'));

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `Generate a high-quality, professional digital art piece for a creative contract described as: ${description}. The style should be modern, institutional, and high-end.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          },
        },
      });

      let foundImage = false;
      if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            setGeneratedImage(`data:image/png;base64,${base64EncodeString}`);
            foundImage = true;
            onNotify(t('IMAGE GENERATED SUCCESSFULLY.', 'IMAGE GÉNÉRÉE AVEC SUCCÈS.'));
            break;
          }
        }
      }

      if (!foundImage) {
        throw new Error('No image part found in response');
      }
    } catch (error) {
      console.error('Image generation failed:', error);
      const fallback = `https://picsum.photos/seed/${encodeURIComponent(description.slice(0, 10))}/800/600`;
      setGeneratedImage(fallback);
      onNotify(t('GENERATION FAILED. USING INSTITUTIONAL PLACEHOLDER.', 'ÉCHEC DE LA GÉNÉRATION. UTILISATION D\'UN ESPACE RÉSERVÉ INSTITUTIONNEL.'));
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const STEPS: Step[] = [
    { 
      id: 1, 
      title: t('Contract Details', 'Détails du Contrat'), 
      description: t('Define the core identity of your creative contract.', 'Définissez l\'identité fondamentale de votre contrat créatif.') 
    },
    { 
      id: 2, 
      title: t('Project Milestones', 'Jalons du Projet'), 
      description: t('Establish key development phases and market impacts.', 'Établissez les phases clés du développement et les impacts sur le marché.') 
    },
    { 
      id: 3, 
      title: t('Financial Structure', 'Structure Financière'), 
      description: t('Configure fractionalization and unit pricing.', 'Configurez la fractionnalisation et le prix unitaire.') 
    },
    { 
      id: 4, 
      title: t('Legal & IP Rights', 'Droits Légaux & PI'), 
      description: t('Establish the intellectual property framework.', 'Établissez le cadre de la propriété intellectuelle.') 
    },
    { 
      id: 5, 
      title: t('Review & Submit', 'Révision & Soumission'), 
      description: t('Finalize the institutional contract for validation.', 'Finalisez le contrat institutionnel pour validation.') 
    }
  ];

  const lyaUnits = (unitPrice / LYA_UNIT_VALUE).toFixed(2);
  const totalValuation = totalUnits * unitPrice;
  const initialDepositAmount = (totalValuation * (depositPercentage / 100));
  const totalLyaUnits = (totalValuation / LYA_UNIT_VALUE)?.toLocaleString() || '0';
  const protocolFee = totalValuation * 0.02;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
      onNotify(`${t('STEP', 'ÉTAPE')} ${currentStep + 1}: ${STEPS[currentStep].title}`);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    onNotify(t('INITIATING SMART CONTRACT DEPLOYMENT...', 'INITIALISATION DU DÉPLOIEMENT DU SMART CONTRACT...'));
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onNotify(t('CONTRACT ISSUED SUCCESSFULLY. PENDING VALIDATION.', 'CONTRAT ÉMIS AVEC SUCCÈS. EN ATTENTE DE VALIDATION.'));
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-20 text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-primary-cyan/10 border border-primary-cyan/20 flex items-center justify-center text-primary-cyan relative">
            <CheckCircle2 size={48} />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-primary-cyan/20 rounded-full"
            />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black font-headline tracking-tighter uppercase">{t('Protocol Initialized', 'Protocole Initialisé')}</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-md mx-auto opacity-70 uppercase tracking-widest">
            {t(
              'Your creative contract has been successfully issued to the LYA Protocol. The contract is now in the ',
              'Votre contrat créatif a été émis avec succès au Protocole LYA. Le contrat est maintenant dans la '
            )}
            <span className="text-primary-cyan">{t('Validation Queue', 'File d\'Attente de Validation')}</span>
            {t(' for expert node consensus.', ' pour le consensus des nœuds experts.')}
          </p>
        </div>
        <div className="pt-8">
          <button 
            onClick={() => window.location.reload()}
            className="px-12 py-4 bg-primary-cyan text-surface-dim font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:bg-white transition-all"
          >
            {t('Return to Dashboard', 'Retour au Tableau de Bord')}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center px-12 pt-10 -mt-10 mb-12">
        <h1 className="text-3xl md:text-5xl font-black font-headline tracking-tighter text-on-surface leading-[0.9] uppercase italic mb-10 flex items-center gap-4">
          <div className="h-[2px] w-12 bg-primary-cyan"></div>
          <span>{t('Creative', 'ÉMETTRE')} <span className="text-primary-cyan drop-shadow-[0_0_20px_rgba(0,224,255,0.4)]">{t('Issuance', 'CREATIVE')}</span></span>
        </h1>
        <p className="text-on-surface-variant max-w-lg mx-auto text-sm leading-relaxed opacity-70 mt-4 uppercase tracking-widest">
          {t('Issue your creative equity into the institutional financial ecosystem.', 'Émettez votre capital créatif dans l\'écosystème financier institutionnel.')}
        </p>
      </header>

      {/* Progress Bar */}
      <div className="relative flex justify-between items-start pt-4">
        <div className="absolute top-8 left-0 w-full h-[1px] bg-white/5 z-0" />
        <div 
          className="absolute top-8 left-0 h-[1px] bg-primary-cyan transition-all duration-500 z-0" 
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        
        {STEPS.map((step) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-4 w-1/4">
            <div className={`w-8 h-8 flex items-center justify-center border-2 transition-all duration-500 ${
              currentStep >= step.id ? 'bg-primary-cyan border-primary-cyan text-surface-dim shadow-[0_0_15px_rgba(0,255,255,0.4)]' : 'bg-surface-dim border-white/10 text-on-surface-variant'
            }`}>
              {currentStep > step.id ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{step.id}</span>}
            </div>
            <div className="text-center">
              <div className={`text-xs font-bold uppercase tracking-widest mb-1 transition-colors ${currentStep >= step.id ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                {step.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-surface-low border border-white/5 p-12 min-h-[400px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-cyan/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-black font-headline uppercase tracking-tighter">{STEPS[currentStep - 1].title}</h2>
              <p className="text-sm text-on-surface-variant uppercase tracking-widest">{STEPS[currentStep - 1].description}</p>
            </div>

            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">{t('Contract Name', 'Nom du Contrat')}</label>
                    <input 
                      className="w-full bg-surface-dim border border-white/10 text-on-surface p-4 focus:border-primary-cyan/50 focus:ring-0 transition-all text-sm uppercase tracking-widest" 
                      placeholder={t('e.g. NEON VOID ARCHIVE', 'ex: ARCHIVE DU VIDE NÉON')} 
                      value={assetName}
                      onChange={(e) => setAssetName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">{t('Issuer / Creator', 'Émetteur / Créateur')}</label>
                    <input 
                      className="w-full bg-surface-dim border border-white/10 text-on-surface p-4 focus:border-primary-cyan/50 focus:ring-0 transition-all text-sm uppercase tracking-widest" 
                      placeholder={t('e.g. ALPHA STUDIO', 'ex: STUDIO ALPHA')} 
                      value={issuerName}
                      onChange={(e) => setIssuerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">{t('Contract Description', 'Description du Contrat')}</label>
                    <div className="relative">
                      <textarea 
                        rows={5} 
                        className="w-full bg-surface-dim border border-white/10 text-on-surface p-4 focus:border-primary-cyan/50 focus:ring-0 transition-all text-sm uppercase tracking-widest resize-none" 
                        placeholder={t('Describe the creative equity and its market potential...', 'Décrivez le capital créatif et son potentiel de marché...')} 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <button 
                          onClick={handleSuggestMilestones}
                          disabled={isSuggestingMilestones || !description}
                          className="p-2 bg-primary-cyan/10 border border-primary-cyan/20 text-primary-cyan rounded-sm hover:bg-primary-cyan/20 transition-all disabled:opacity-50 group/milestone"
                        >
                          <Sparkles size={14} className={isSuggestingMilestones ? 'animate-pulse' : ''} />
                          <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-surface-low border border-white/10 px-2 py-1 text-[8px] uppercase tracking-widest opacity-0 group-hover/milestone:opacity-100 transition-opacity pointer-events-none">
                            {t('AI Suggest Milestones', 'Suggestions de Jalons par l\'IA')}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">{t('Contract Visualization', 'Visualisation du Contrat')}</label>
                    <div className="relative aspect-square bg-surface-dim border border-white/10 overflow-hidden group">
                      {generatedImage ? (
                        <img 
                          src={generatedImage} 
                          alt="Generated Contract" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant/20 p-8 text-center">
                          <ImageIcon size={48} className="mb-4" />
                          <p className="text-xs uppercase tracking-[0.2em]">{t('No visualization generated', 'Aucune visualisation générée')}</p>
                        </div>
                      )}
                      
                      {isGeneratingImage && (
                        <div className="absolute inset-0 bg-surface-dim/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                          <div className="w-8 h-8 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs uppercase tracking-widest text-primary-cyan animate-pulse">{t('Synthesizing...', 'Synthèse...')}</p>
                        </div>
                      )}

                      <div className="absolute bottom-4 right-4">
                        <button 
                          onClick={handleGenerateImage}
                          disabled={isGeneratingImage || !description}
                          className="p-3 bg-primary-cyan text-surface-dim rounded-full shadow-lg hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group/gen"
                        >
                          <Sparkles size={16} className={isGeneratingImage ? 'animate-pulse' : ''} />
                          <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-surface-low border border-white/10 px-2 py-1 text-[8px] uppercase tracking-widest opacity-0 group-hover/gen:opacity-100 transition-opacity pointer-events-none">
                            {t('AI Generate Visualization', 'Génération IA de Visualisation')}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-white/10 p-6 text-center space-y-4 hover:border-primary-cyan/30 transition-all cursor-pointer group">
                    <div className="flex justify-center">
                      <div className="p-3 bg-white/5 text-on-surface-variant group-hover:text-primary-cyan transition-colors">
                        <Upload size={24} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest">{t('Upload Master Contract File', 'Télécharger le Fichier Maître du Contrat')}</p>
                      <p className="text-[8px] text-on-surface-variant uppercase tracking-widest mt-1">{t('Max 100MB', 'Max 100 Mo')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface">{t('Project Roadmap', 'Feuille de Route du Projet')}</h3>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{t('Define the milestones that will drive contract value.', 'Définissez les jalons qui stimuleront la valeur du contrat.')}</p>
                  </div>
                  <button 
                    onClick={handleSuggestMilestones}
                    disabled={isSuggestingMilestones || !description}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-cyan/10 border border-primary-cyan/20 text-primary-cyan text-[10px] font-bold uppercase tracking-widest hover:bg-primary-cyan/20 transition-all disabled:opacity-50"
                  >
                    <Sparkles size={14} className={isSuggestingMilestones ? 'animate-pulse' : ''} />
                    {isSuggestingMilestones ? t('Analyzing...', 'Analyse...') : t('AI Suggest Milestones', 'Suggestions de Jalons par l\'IA')}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {milestones.length > 0 ? (
                    milestones.map((milestone, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-surface-dim border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-primary-cyan/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary-cyan/10 flex items-center justify-center text-primary-cyan">
                            <Calendar size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface">{milestone.label}</h4>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{t('Estimated Date', 'Date Estimée')}: {milestone.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-right">
                            <div className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">{t('Market Impact', 'Impact sur le Marché')}</div>
                            <div className="flex items-center gap-1 text-primary-cyan font-bold">
                              <TrendingUp size={14} />
                              <span className="text-sm font-mono">+{milestone.priceImpact}%</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => setMilestones(milestones.filter((_, i) => i !== index))}
                            className="p-2 text-on-surface-variant hover:text-red-400 transition-colors"
                          >
                            <Plus size={16} className="rotate-45" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-12 border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-on-surface-variant/40 space-y-4">
                      <Calendar size={48} className="opacity-20" />
                      <p className="text-xs uppercase tracking-[0.2em]">{t('No milestones defined yet', 'Aucun jalon défini pour le moment')}</p>
                      <p className="text-[10px] uppercase tracking-widest text-center max-w-xs leading-relaxed">
                        {t('Use the AI suggestion tool or add milestones manually to build your project roadmap.', 'Utilisez l\'outil de suggestion IA ou ajoutez des jalons manuellement pour construire la feuille de route de votre projet.')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button 
                    onClick={() => setMilestones([...milestones, { label: 'New Milestone', date: '2026-12', status: 'UPCOMING', priceImpact: 5 }])}
                    className="w-full py-4 border border-dashed border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:border-primary-cyan/30 hover:text-primary-cyan transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={14} />
                    {t('Add Manual Milestone', 'Ajouter un Jalon Manuel')}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">{t('Total Units (Fractionalization)', 'Unités Totales (Fractionnalisation)')}</label>
                      <span className="text-xs text-primary-cyan font-bold uppercase tracking-widest font-mono">= {totalLyaUnits} LYA (@ {lyaUnits} LYA/{t('Unit', 'Unité')})</span>
                    </div>
                    <input 
                      type="number" 
                      className="w-full bg-surface-dim border border-white/10 text-on-surface p-4 focus:border-primary-cyan/50 focus:ring-0 transition-all font-mono text-sm" 
                      value={totalUnits}
                      onChange={(e) => setTotalUnits(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">{t('Initial Unit Price (USD)', 'Prix Unitaire Initial (USD)')}</label>
                      <span className="text-xs text-primary-cyan/60 uppercase tracking-widest font-mono">{t('Calculation', 'Calcul')}: ${unitPrice} / ${LYA_UNIT_VALUE}</span>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" 
                        className="w-full bg-surface-dim border border-white/10 text-on-surface p-4 focus:border-primary-cyan/50 focus:ring-0 transition-all font-mono pr-24 text-sm" 
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(Number(e.target.value))}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary-cyan uppercase tracking-widest">
                        {lyaUnits} LYA
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">{t('Contract Duration (Months)', 'Durée du Contrat (Mois)')}</label>
                    <input 
                      type="number" 
                      className="w-full bg-surface-dim border border-white/10 text-on-surface p-4 focus:border-primary-cyan/50 focus:ring-0 transition-all font-mono text-sm" 
                      value={contractDuration}
                      onChange={(e) => setContractDuration(e.target.value)}
                      placeholder="e.g. 12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">{t('Maturity Date', 'Date d\'Échéance')}</label>
                    <input 
                      type="date" 
                      className="w-full bg-surface-dim border border-white/10 text-on-surface p-4 focus:border-primary-cyan/50 focus:ring-0 transition-all font-mono text-sm" 
                      value={maturityDate}
                      onChange={(e) => setMaturityDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-end">
                      <label className="text-xs uppercase tracking-widest text-accent-gold font-bold">{t('Initial Deposit Required (%)', 'Dépôt Initial Requis (%)')}</label>
                      <span className="text-xs text-accent-gold font-bold font-mono">{formatPrice(initialDepositAmount)}</span>
                    </div>
                    <div className="relative">
                      <input 
                        type="range"
                        min="5"
                        max="50"
                        step="1"
                        className="w-full accent-accent-gold h-2 bg-surface-dim rounded-lg appearance-none cursor-pointer"
                        value={depositPercentage}
                        onChange={(e) => setDepositPercentage(Number(e.target.value))}
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-on-surface-variant font-mono">5%</span>
                        <span className="text-xs text-accent-gold font-black font-mono">{depositPercentage}%</span>
                        <span className="text-[10px] text-on-surface-variant font-mono">50%</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-widest leading-relaxed mt-2 italic">
                      {t('This amount must be deposited by the creator to activate the contract issuance protocol.', 'Ce montant doit être déposé par le créateur pour activer le protocole d\'émission du contrat.')}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">{t('Rarity Classification', 'Classification de Rareté')}</label>
                    <select className="w-full bg-surface-dim border border-white/10 text-on-surface p-4 focus:border-primary-cyan/50 focus:ring-0 transition-all text-sm uppercase tracking-widest appearance-none">
                      <option>{t('Common', 'Commun')}</option>
                      <option>{t('Rare', 'Rare')}</option>
                      <option>{t('Epic', 'Épique')}</option>
                      <option>{t('Legendary', 'Légendaire')}</option>
                    </select>
                  </div>
                  <div className="p-6 bg-primary-cyan/5 border border-primary-cyan/20 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info size={14} className="text-primary-cyan" />
                      <span className="text-xs font-bold uppercase tracking-widest text-primary-cyan">{t('LYA Standard Unit', 'Unité Standard LYA')}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed uppercase tracking-wider">
                      {t(
                        '1 LYA Unit is fixed at ',
                        '1 Unité LYA est fixée à '
                      )}
                      <span className="text-on-surface font-bold text-sm">{formatLYA()}</span>. 
                      {t(
                        ' Your contract will be traded in LYA Units on the exchange to ensure global liquidity and stability.',
                        ' Votre contrat sera échangé en Unités LYA sur la bourse pour assurer la liquidité et la stabilité mondiales.'
                      )}
                    </p>
                    <div className="pt-4 border-t border-primary-cyan/10 space-y-2">
                      <div className="flex justify-between text-xs uppercase tracking-widest text-on-surface-variant">
                        <span>{t('Total Valuation', 'Valorisation Totale')}</span>
                        <span className="text-on-surface font-bold">${totalValuation?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between text-xs uppercase tracking-widest text-on-surface-variant">
                        <span>{t('Total LYA Units', 'Unités LYA Totales')}</span>
                        <span className="text-primary-cyan font-bold">{totalLyaUnits} LYA</span>
                      </div>
                      <div className="flex justify-between text-xs uppercase tracking-widest text-on-surface-variant">
                        <span>{t('Protocol Fee (2%)', 'Frais de Protocole (2%)')}</span>
                        <span className="text-on-surface font-bold">${protocolFee?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between text-xs uppercase tracking-widest text-accent-gold pt-2 border-t border-accent-gold/10">
                        <span>{t('Initial Deposit', 'Dépôt Initial')} ({depositPercentage}%)</span>
                        <span className="font-black">{formatPrice(initialDepositAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    t('Commercial Usage Rights', 'Droits d\'Usage Commercial'),
                    t('Derivative Creation Rights', 'Droits de Création de Dérivés'),
                    t('Public Exhibition Rights', 'Droits d\'Exposition Publique'),
                    t('Institutional Lending Rights', 'Droits de Prêt Institutionnel'),
                    t('Resale Royalty (10%)', 'Redevance de Revente (10%)'),
                    t('Governance Voting Rights', 'Droits de Vote de Gouvernance')
                  ].map(right => (
                    <div key={right} className="flex items-center gap-4 p-4 bg-surface-dim border border-white/5 hover:border-primary-cyan/30 transition-all cursor-pointer group">
                      <div className="w-5 h-5 border border-white/20 flex items-center justify-center group-hover:border-primary-cyan transition-colors">
                        <div className="w-2 h-2 bg-primary-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-xs uppercase tracking-widest font-bold">{right}</span>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-accent-gold/5 border border-accent-gold/20 flex gap-4">
                  <Info className="text-accent-gold shrink-0" size={20} />
                  <p className="text-xs text-accent-gold leading-relaxed uppercase tracking-wider">
                    {t(
                      'Legal rights are hard-coded into the smart contract. Once deployed, these terms are immutable and enforceable across all jurisdictions via the LYA Legal Framework.',
                      'Les droits légaux sont codés en dur dans le smart contract. Une fois déployés, ces termes sont immuables et exécutoires dans toutes les juridictions via le Cadre Légal LYA.'
                    )}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="bg-surface-dim border border-white/5 p-8 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex gap-6">
                      {generatedImage && (
                        <div className="w-24 h-24 border border-white/10 overflow-hidden shrink-0">
                          <img 
                            src={generatedImage} 
                            alt="Contract Preview" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold font-headline uppercase tracking-widest text-primary-cyan">{assetName || 'NEON VOID ARCHIVE'}</h3>
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">{t('By', 'Par')} {issuerName || 'ALPHA STUDIO'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold uppercase tracking-widest text-accent-gold">{t('Legendary Tier', 'Niveau Légendaire')}</div>
                      <div className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">{totalUnits?.toLocaleString() || '0'} {t('Units', 'Unités')} @ {lyaUnits} LYA</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">(${unitPrice?.toLocaleString() || '0'} / {t('Unit', 'Unité')})</div>
                      <div className="text-[10px] text-primary-cyan uppercase tracking-widest mt-2">{t('Maturity', 'Échéance')}: {maturityDate} ({contractDuration} {t('Months', 'Mois')})</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">{t('Registry Address', 'Adresse du Registre')}</h4>
                        <p className="text-sm font-mono text-on-surface">0x7F9D...E2A4 (PROTOCOL_PENDING)</p>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">{t('Contract Creation Date', 'Date de Création du Contrat')}</h4>
                        <p className="text-sm font-mono text-on-surface">{new Date().toLocaleDateString(t('en-US', 'fr-FR'), { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div className="pt-2 border-t border-white/5">
                        <h4 className="text-xs uppercase tracking-widest text-accent-gold font-bold mb-1">{t('Required Initial Deposit', 'Dépôt Initial Requis')}</h4>
                        <p className="text-lg font-black text-accent-gold italic">{formatPrice(initialDepositAmount)} <span className="text-[10px] opacity-60">({depositPercentage}%)</span></p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">{t('Project Milestones', 'Jalons du Projet')}</h4>
                        <div className="space-y-1">
                          {milestones.map((m, i) => (
                            <div key={i} className="flex justify-between text-[10px] uppercase tracking-widest">
                              <span className="text-on-surface-variant">{m.label}</span>
                              <span className="text-primary-cyan font-bold">+{m.priceImpact}%</span>
                            </div>
                          ))}
                          {milestones.length === 0 && <p className="text-[10px] text-on-surface-variant italic">{t('None defined', 'Aucun défini')}</p>}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-1">{t('Contract Status', 'Statut du Contrat')}</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-pulse" />
                          <span className="text-sm font-bold text-accent-gold uppercase tracking-widest">{t('Pending Deployment', 'Déploiement en Attente')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <ShieldCheck size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">{t('IP Verified', 'PI Vérifiée')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <FileText size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">{t('Rights Encrypted', 'Droits Chiffrés')}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary-cyan">
                        <Award size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">{t('Institutional Ready', 'Prêt Institutionnel')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-primary-cyan/5 border border-primary-cyan/20">
                  <p className="text-xs text-primary-cyan leading-relaxed uppercase tracking-wider text-center">
                    {t(
                      'By clicking "Deploy Contract", you authorize the LYA Protocol to generate a smart contract on the mainnet. This action is irreversible.',
                      'En cliquant sur "Déployer le Contrat", vous autorisez le Protocole LYA à générer un smart contract sur le mainnet. Cette action est irréversible.'
                    )}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-8">
        <button 
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
          className={`flex items-center gap-2 px-8 py-4 border border-white/10 text-xs font-bold uppercase tracking-widest transition-all ${
            currentStep === 1 || isSubmitting ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5 active:scale-95'
          }`}
        >
          <ChevronLeft size={16} />
          {t('Back', 'Retour')}
        </button>
        <button 
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-12 py-4 bg-primary-cyan text-surface-dim font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:bg-white transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Plus size={16} />
              </motion.div>
              {t('Deploying...', 'Déploiement...')}
            </>
          ) : (
            <>
              {currentStep === STEPS.length ? t('Deploy Contract', 'Déployer le Contrat') : t('Next Step', 'Étape Suivante')}
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
