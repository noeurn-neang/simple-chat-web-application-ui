import React from 'react';
import { ChevronLeft, Moon, Sun, Monitor, Bell, Lock, Globe, HelpCircle, Palette, Type, Square } from 'lucide-react';
import { Theme, ThemeConfig } from '../types';

interface SettingsProps {
  onBack: () => void;
  config: ThemeConfig;
  onConfigChange: (config: ThemeConfig) => void;
}

const COLORS = [
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Violet', value: '#7c3aed' },
];

const RADIUS_OPTIONS = [
  { label: 'Sharp', value: '0px' },
  { label: 'Soft', value: '0.75rem' },
  { label: 'Round', value: '1.25rem' },
  { label: 'Bubble', value: '2rem' },
];

const FONT_OPTIONS = [
  { label: 'Aa', size: '13px', name: 'Small' },
  { label: 'Aa', size: '14px', name: 'Medium' },
  { label: 'Aa', size: '16px', name: 'Large' },
];

const BACKGROUNDS = [
  { name: 'Cubes', url: 'https://www.transparenttextures.com/patterns/cubes.png' },
  { name: 'Diamonds', url: 'https://www.transparenttextures.com/patterns/carbon-fibre.png' },
  { name: 'Dots', url: 'https://www.transparenttextures.com/patterns/60-lines.png' },
  { name: 'None', url: '' },
];

export default function Settings({ onBack, config, onConfigChange }: SettingsProps) {
  const updateConfig = (updates: Partial<ThemeConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <div className="flex flex-col h-full bg-nebula-sidebar animate-in slide-in-from-left duration-300">
      {/* Header */}
      <div className="p-5 flex items-center gap-4 bg-white dark:bg-nebula-sidebar border-b border-nebula-border sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
          <ChevronLeft className="w-5 h-5 text-nebula-primary" />
        </button>
        <h2 className="text-xl font-bold text-nebula-text tracking-tight">Settings</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* User Profile Info */}
        <div className="p-8 flex flex-col items-center text-center bg-white dark:bg-nebula-sidebar">
          <div className="relative mb-4">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Me" 
              className="w-24 h-24 rounded-2xl ring-4 ring-nebula-primary/10 shadow-xl object-cover transition-all"
              style={{ borderRadius: config.borderRadius }} 
              alt="Profile"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-nebula-sidebar rounded-full" />
          </div>
          <h3 className="text-lg font-bold text-nebula-text">John Doe</h3>
          <p className="text-sm font-medium text-nebula-text-secondary">@johndoe • Pro Member</p>
        </div>

        {/* Setting Sections */}
        <div className="p-4 space-y-6">
          {/* Appearance Section */}
          <div>
            <h4 className="px-2 mb-2 text-[11px] font-bold uppercase tracking-widest text-nebula-text-secondary opacity-60">
              Appearance
            </h4>
            <div className="bg-white dark:bg-nebula-sidebar rounded-2xl border border-nebula-border overflow-hidden shadow-sm p-4 space-y-6">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => updateConfig({ mode: config.mode === 'light' ? 'dark' : 'light' })}
                className="w-full flex items-center gap-4 text-left group"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-nebula-chat-bg dark:bg-nebula-bg text-nebula-text-secondary group-hover:text-nebula-primary transition-colors">
                  {config.mode === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <span className="flex-1 text-[14px] font-semibold text-nebula-text">Dark Mode</span>
                <div className={`w-11 h-6 rounded-full relative transition-all p-1 ${config.mode === 'dark' ? 'bg-nebula-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
                   <div className={`w-4 h-4 bg-white rounded-full transition-all shadow-sm ${config.mode === 'dark' ? 'ml-5' : 'ml-0'}`} />
                </div>
              </button>

              {/* Accent Color */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Palette className="w-4 h-4 text-nebula-text-secondary" />
                  <span className="text-[13px] font-bold text-nebula-text">Accent Color</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => updateConfig({ primaryColor: c.value })}
                      className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${
                        config.primaryColor === c.value ? 'ring-2 ring-offset-2 ring-nebula-primary dark:ring-offset-nebula-sidebar' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.value }}
                    >
                      {config.primaryColor === c.value && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Corner Radius */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Square className="w-4 h-4 text-nebula-text-secondary" />
                  <span className="text-[13px] font-bold text-nebula-text">Corner Softness</span>
                </div>
                <div className="flex bg-nebula-chat-bg dark:bg-nebula-bg p-1 rounded-xl gap-1">
                  {RADIUS_OPTIONS.map((r) => (
                    <button
                      key={r.label}
                      onClick={() => updateConfig({ borderRadius: r.value })}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        config.borderRadius === r.value 
                          ? 'bg-white dark:bg-nebula-sidebar text-nebula-primary shadow-sm' 
                          : 'text-nebula-text-secondary hover:text-nebula-text'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Type className="w-4 h-4 text-nebula-text-secondary" />
                  <span className="text-[13px] font-bold text-nebula-text">Text Size</span>
                </div>
                <div className="flex justify-between items-center bg-nebula-chat-bg dark:bg-nebula-bg p-1 rounded-xl">
                  {FONT_OPTIONS.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => updateConfig({ fontSize: f.size })}
                      className={`flex-1 flex flex-col items-center py-1 rounded-lg transition-all ${
                        config.fontSize === f.size 
                          ? 'bg-white dark:bg-nebula-sidebar text-nebula-primary shadow-sm' 
                          : 'text-nebula-text-secondary hover:text-nebula-text'
                      }`}
                    >
                      <span style={{ fontSize: f.size }} className="font-bold leading-none mb-1">{f.label}</span>
                      <span className="text-[9px] uppercase tracking-tighter">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Background */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Monitor className="w-4 h-4 text-nebula-text-secondary" />
                  <span className="text-[13px] font-bold text-nebula-text">Chat Wallpaper</span>
                </div>
                <div className="flex bg-nebula-chat-bg dark:bg-nebula-bg p-1 rounded-xl gap-1">
                  {BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.name}
                      onClick={() => updateConfig({ chatBackground: bg.url })}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        config.chatBackground === bg.url 
                          ? 'bg-white dark:bg-nebula-sidebar text-nebula-primary shadow-sm' 
                          : 'text-nebula-text-secondary hover:text-nebula-text'
                      }`}
                    >
                      {bg.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Standard Settings */}
          <div>
            <h4 className="px-2 mb-2 text-[11px] font-bold uppercase tracking-widest text-nebula-text-secondary opacity-60">
              Other
            </h4>
            <div className="bg-white dark:bg-nebula-sidebar rounded-2xl border border-nebula-border overflow-hidden shadow-sm">
              <button className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-nebula-primary/5 transition-colors border-b border-nebula-border/50 text-left">
                <Bell className="w-5 h-5 text-nebula-text-secondary" />
                <span className="text-[14px] font-semibold text-nebula-text">Notifications</span>
              </button>
              <button className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-nebula-primary/5 transition-colors border-b border-nebula-border/50 text-left">
                <Lock className="w-5 h-5 text-nebula-text-secondary" />
                <span className="text-[14px] font-semibold text-nebula-text">Security</span>
              </button>
              <button className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-nebula-primary/5 transition-colors text-left">
                <Globe className="w-5 h-5 text-nebula-text-secondary" />
                <span className="text-[14px] font-semibold text-nebula-text">Language</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <div className="inline-flex items-center gap-2 bg-nebula-primary/10 px-3 py-1 rounded-full mb-2">
            <div className="w-1.5 h-1.5 bg-nebula-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-nebula-primary uppercase tracking-wider">Nebula OS v1.1</span>
          </div>
          <p className="text-[11px] text-nebula-text-secondary font-medium">Fully customizable experience</p>
        </div>
      </div>
    </div>
  );
}
