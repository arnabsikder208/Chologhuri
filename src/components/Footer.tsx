import React from 'react';
import { useI18n } from '../i18n';
import { Compass, MapPin, Phone, ShieldCheck, Mail, Heart, Database, Code, FileText, Layers } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setDistrictFilter?: (district: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, setDistrictFilter }) => {
  const { t } = useI18n();
  const chattogramDistricts = [
    'Chattogram City',
    'Cox\'s Bazar',
    'Bandarban',
    'Rangamati',
    'Sitakunda',
    'Mirsarai',
    'Anwara',
  ];

  const handleDistrictClick = (district: string) => {
    if (setDistrictFilter) {
      setDistrictFilter(district);
    }
    setActiveTab('explore');
  };

  return (
    <footer className="glass-footer relative z-10 text-slate-300 pt-12 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Vision Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Cholo<span className="text-emerald-400">Ghuri</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t('footer.about')}{' '}
              <strong> Version 1 (MVP)</strong> is engineered exclusively for destinations inside <strong>Chattogram Division</strong>.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Certified Bangladesh Tourist Police Hotlines Available</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {t('footer.division')}
            </h4>
            <ul className="space-y-2 text-xs">
              {chattogramDistricts.map((d) => (
                <li key={d}>
                  <button
                    onClick={() => handleDistrictClick(d)}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3 text-emerald-500" />
                    <span>{d}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {t('footer.features')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('explore')} className="hover:text-emerald-400 transition-colors">
                  Explore Destinations
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ai-planner')} className="hover:text-emerald-400 transition-colors">
                  AI Trip Planner (Gemini)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('hotels')} className="hover:text-emerald-400 transition-colors">
                  Hotel Discovery & Compare
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('blogs')} className="hover:text-emerald-400 transition-colors">
                  Travel Blogs & Stories
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('community')} className="hover:text-emerald-400 transition-colors">
                  Traveler Groups & Discussions
                </button>
              </li>
            </ul>
          </div>

          {/* Developer & Architecture Docs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {t('footer.developer')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-teal-400" />
                  <span>MongoDB Collections Schema</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-teal-400" />
                  <span>REST API Specifications</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  <span>Visual ER Diagram</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>PDF Wireframe Alignment</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Emergency Assistance Banner */}
        <div className="py-4 my-6 bg-emerald-950/80 border border-emerald-800/80 rounded-xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white">{t('footer.hotline')}</p>
              <p className="text-slate-400">Chattogram Division Support: +880 1320-000000 | National Emergency: 999</p>
            </div>
          </div>
          <a
            href="tel:999"
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors shrink-0"
          >
            {t('footer.call')}
          </a>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>{t('footer.rights')}</p>
          <p className="flex items-center gap-1">
            {t('footer.builtFor')} <span>Chattogram Division MVP</span> {t('footer.with')} <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {t('footer.in')}
          </p>
        </div>
      </div>
    </footer>
  );
};
