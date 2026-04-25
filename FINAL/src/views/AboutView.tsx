
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Target, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Users, 
  Award,
  ChevronRight,
  TrendingUp,
  Heart,
  MousePointer2
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { Logo } from '../components/ui/Logo';
import { View } from '../components/ui/Sidebar';

interface AboutViewProps {
  onViewChange?: (view: View) => void;
  onNotify?: (msg: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onViewChange, onNotify }) => {
  const { t } = useTranslation();
  const [isColored, setIsColored] = React.useState(false);
  const [bgImage, setBgImage] = React.useState('https://picsum.photos/seed/abstract-1/1920/1080');

  React.useEffect(() => {
    const images = [
      'https://picsum.photos/seed/abstract-1/1920/1080',
      'https://picsum.photos/seed/creative-2/1920/1080',
      'https://picsum.photos/seed/digital-3/1920/1080',
      'https://picsum.photos/seed/art-4/1920/1080',
      'https://picsum.photos/seed/tech-5/1920/1080'
    ];
    const interval = setInterval(() => {
      setBgImage(images[Math.floor(Math.random() * images.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: t('Evaluated Projects', 'Projets évalués'), value: '10K+', sub: t('Global Database', 'Base de données mondiale') },
    { label: t('Active Users', 'Utilisateurs actifs'), value: '50K+', sub: t('Verified Network', 'Réseau vérifié') },
    { label: t('Funds Raised', 'Fonds levés'), value: '25M€', sub: t('Creative Equity', 'Equity Créative') },
    { label: t('Success Rate', 'Taux de réussite'), value: '87%', sub: t('Project Completion', 'Finalisation de projet') }
  ];

  return (
    <div className="space-y-16 pb-24">
      {/* Hero Section */}
      <section 
        onMouseEnter={() => setIsColored(true)}
        onMouseLeave={() => setIsColored(false)}
        onClick={() => setIsColored(!isColored)}
        className="relative h-[500px] flex flex-col items-center justify-center overflow-hidden rounded-[3rem] mx-6 shadow-2xl cursor-pointer group bg-black"
      >
        {/* Background Image with grayscale effect */}
        <motion.div 
          animate={{ 
            filter: isColored ? 'grayscale(0%) brightness(0.6)' : 'grayscale(100%) brightness(0.2)',
            scale: isColored ? 1.1 : 1
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <AnimatePresence mode="wait">
            <motion.img 
              key={bgImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              src={bgImage} 
              alt="Background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </motion.div>

        {/* Interactive Logo Content */}
        <div className="relative z-10 flex flex-col items-center gap-12 w-full">
          <div className="text-center space-y-6 max-w-5xl px-6 relative">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex justify-center mb-4"
            >
              <div className={`px-8 py-3 border rounded-full backdrop-blur-3xl transition-all duration-1000 ${isColored ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5'}`}>
                <span className={`text-xs font-black uppercase tracking-[0.5em] transition-colors duration-1000 ${isColored ? 'text-primary-cyan' : 'text-white/20'}`}>
                  {t('ESTABLISHED 2006', 'ÉTABLI EN 2006')}
                </span>
              </div>
            </motion.div>
            
            <div className="relative inline-block">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.85] relative"
              >
                <span className={`transition-colors duration-1000 ${isColored ? 'text-white' : 'text-white/10'}`}>
                  {t('About', 'À propos de')}
                </span>
                <br />
                <span className={`bg-clip-text text-transparent bg-gradient-to-r transition-all duration-1000 ${isColored ? 'from-primary-cyan via-white to-accent-purple' : 'from-white/5 via-white/10 to-white/5'}`}>
                  LINKYOURART
                </span>
              </motion.h1>
            </div>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto transition-all duration-1000 ${isColored ? 'text-on-surface-variant opacity-90' : 'text-white/5'}`}
            >
              {t(
                "We are the world's first creative exchange center that transforms how artists find funding and how investors discover the creative projects of tomorrow.",
                "Nous sommes le premier centre d'échanges créatif mondial qui transforme la manière dont les artistes trouvent des financements et dont les investisseurs découvrent les projets créatifs de demain."
              )}
            </motion.p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-cyan/10 border border-primary-cyan/20 flex items-center justify-center">
              <History className="text-primary-cyan" size={24} />
            </div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">
              {t('Our History', 'Notre Histoire')}
            </h2>
          </div>
          
          <div className="space-y-6 text-on-surface-variant leading-relaxed text-base md:text-lg font-medium opacity-70">
            <p>
              {t(
                "LINKYOURART, founded in 2006, is among the first representation and networking hubs dedicated to creative talents on an international scale. From its beginnings, the platform's mission has been to create bridges between artists and cultural industries, supporting directors, screenwriters, producers, composers, musicians, 3D artists, animators, designers, illustrators, photographers, visual and contemporary artists, video game developers, as well as creators from digital arts, performing arts, and new media.",
                "LINKYOURART, fondé en 2006, figure parmi les premiers hubs de représentation et de mise en relation dédiés aux talents créatifs à l'échelle internationale. Dès ses débuts, la plateforme s'est donnée pour mission de créer des passerelles entre les artistes et les industries culturelles, en accompagnant des réalisateurs, scénaristes, producteurs, compositeurs, musiciens, artistes 3D, animateurs, designers, illustrateurs, photographes, artistes visuels et contemporains, développeurs de jeux vidéo, ainsi que des créateurs issus des arts numériques, de la scène et des nouveaux médias."
              )}
            </p>
            <p>
              {t(
                "Conceived as a space for convergence between art, technology, and industry, LINKYOURART has contributed to revealing and supporting both emerging and established talents, fostering collaborations, visibility, and the realization of ambitious artistic projects.",
                "Pensé comme un espace de convergence entre l'art, la technologie et l'industrie, LINKYOURART a contribué à révéler et accompagner des talents émergents comme confirmés, en favorisant les collaborations, la visibilité et la concrétisation de projets artistiques ambitieux."
              )}
            </p>
            <p>
              {t(
                "Today, on its 20th anniversary, LINKYOURART is embarking on a new stage with the launch of an entirely redesigned platform, more contemporary, more immersive, and aligned with new economic models of creation.",
                "Aujourd'hui, à l'occasion de ses 20 ans, LINKYOURART entame une nouvelle étape avec le lancement d'une plateforme entièrement repensée, plus contemporaine, plus immersive et alignée avec les nouveaux modèles économiques de la création."
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-surface-low/30 border border-white/5 rounded-2xl">
              <p className="text-2xl font-black text-primary-cyan italic mb-1">2006</p>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{t('FOUNDATION', 'FONDATION')}</p>
            </div>
            <div className="p-6 bg-surface-low/30 border border-white/5 rounded-2xl">
              <p className="text-2xl font-black text-accent-purple italic mb-1">2026</p>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{t('REVOLUTION', 'RÉVOLUTION')}</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-primary-cyan/10 blur-3xl rounded-full opacity-50" />
          <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center bg-surface-low/20 group">
            <Logo 
              size={320} 
              color="multi"
              className="transition-all duration-1000 drop-shadow-[0_0_50px_rgba(0,224,255,0.3)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-10 left-10 right-10">
              <div className="p-8 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl">
                <p className="text-sm font-bold text-white leading-relaxed italic">
                  "{t(
                    "More than a platform, LINKYOURART stands today as a hybrid creative and financial ecosystem.",
                    "Plus qu'une plateforme, LINKYOURART s'impose aujourd'hui comme un écosystème créatif et financier hybride."
                  )}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-surface-low/30 border border-white/5 p-10 rounded-3xl text-center group hover:border-primary-cyan/30 transition-all shadow-xl">
              <h3 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-2 group-hover:text-primary-cyan transition-colors">
                {stat.value}
              </h3>
              <p className="text-xs font-black text-on-surface uppercase tracking-[0.2em] mb-1">
                {stat.label}
              </p>
              <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest opacity-50">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="px-8 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
            {t('Our Values', 'Nos Valeurs')}
          </h2>
          <div className="w-24 h-1 bg-primary-cyan mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: t('Mission', 'Mission'),
              icon: <Target className="text-primary-cyan" />,
              desc: t(
                "Transforming creative projects into living assets. We professionally evaluate each project, then break it down into contractual rights indexed to its performance.",
                "Transformer les projets créatifs en actifs vivants. Nous évaluons professionnellement chaque projet, puis le découpons en droits contractuels indexés sur sa performance."
              )
            },
            {
              title: t('Transparency', 'Transparence'),
              icon: <ShieldCheck className="text-emerald-400" />,
              desc: t(
                "Our LYA algorithm evaluates each project according to 5 objective and public criteria: Portfolio, Recognition, Community, Consistency, Potential. Zero opacity, 100% verifiable data.",
                "Notre algorithme LYA évalue chaque projet selon 5 critères objectifs et publics : Portfolio, Reconnaissance, Communauté, Cohérence, Potentiel. Zéro opacité, 100% de données vérifiables."
              )
            },
            {
              title: t('Innovation', 'Innovation'),
              icon: <Zap className="text-accent-purple" />,
              desc: t(
                "We combine professional evaluation, indexed contractual rights, and a P2P market in a spectacular fintech experience. Neural Network LYA, Project DNA, Live Trading Feed.",
                "Nous combinons évaluation professionnelle, droits contractuels indexés et marché P2P dans une expérience fintech spectaculaire. Neural Network LYA, Project DNA, Live Trading Feed."
              )
            },
            {
              title: t('International', 'International'),
              icon: <Globe className="text-primary-cyan" />,
              desc: t(
                "LinkYourArt is multilingual and open to creative projects, investors, and professionals from all over the world. The creative industry has no borders.",
                "LinkYourArt est multilingue et ouvert aux projets créatifs, investisseurs et professionnels du monde entier. L'industrie créative n'a pas de frontières."
              )
            }
          ].map((value, i) => (
            <div key={i} className="bg-surface-low/30 border border-white/5 p-10 rounded-[2rem] space-y-6 hover:border-white/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">{value.title}</h3>
              </div>
              <p className="text-base text-on-surface-variant font-medium leading-relaxed opacity-70">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8">
        <div className="bg-gradient-to-r from-primary-cyan/20 via-accent-purple/20 to-primary-cyan/20 border border-white/10 rounded-[3rem] p-16 text-center space-y-10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
              {t('Join the Creative Revolution', 'Rejoignez la révolution créative')}
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-lg font-medium opacity-80">
              {t(
                "Whether you are a creator, investor, or art professional, LinkYourArt is made for you.",
                "Que vous soyez créateur, investisseur, ou professionnel de l'art, LinkYourArt est fait pour vous."
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <button 
              onClick={() => onViewChange?.('SIGNUP')}
              className="px-12 py-6 bg-primary-cyan text-surface-dim font-black uppercase italic tracking-[0.2em] text-sm hover:bg-white transition-all shadow-[0_20px_40px_rgba(0,224,255,0.2)] active:scale-95"
            >
              {t('Start Now', 'Commencer maintenant')}
            </button>
            <button 
              onClick={() => onViewChange?.('HOME')}
              className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black uppercase italic tracking-[0.2em] text-sm hover:bg-white hover:text-surface-dim transition-all active:scale-95"
            >
              {t('Learn More', 'En savoir plus')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer Quote */}
      <footer className="px-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <Heart className="text-accent-pink animate-pulse" size={32} />
          <p className="text-xs font-black text-on-surface-variant uppercase tracking-[0.5em] opacity-40">
            MADE WITH PASSION FOR THE CREATIVE ECONOMY
          </p>
        </div>
      </footer>
    </div>
  );
};
