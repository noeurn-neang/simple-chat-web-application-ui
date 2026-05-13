/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Settings from './components/Settings';
import { Chat, ThemeConfig } from './types';

const DEFAULT_CONFIG: ThemeConfig = {
  mode: 'light',
  primaryColor: '#4f46e5',
  borderRadius: '1rem',
  fontSize: '14px',
  chatBackground: 'https://www.transparenttextures.com/patterns/cubes.png',
};

export default function App() {
  const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined);
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('nebula-theme-config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', config.mode === 'dark');
    root.style.setProperty('--nebula-primary', config.primaryColor);
    root.style.setProperty('--nebula-radius', config.borderRadius);
    root.style.setProperty('--nebula-font-size', config.fontSize);
    
    localStorage.setItem('nebula-theme-config', JSON.stringify(config));
  }, [config]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setShowSettings(false);
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-nebula-bg selection:bg-nebula-primary/30 ${config.mode === 'dark' ? 'dark' : ''}`}>
      {/* Left Panel (Sidebar or Settings) */}
      <div className={`w-full md:w-auto h-full border-r border-nebula-border ${selectedChat ? 'hidden md:block' : 'block'}`}>
        {showSettings ? (
          <div className="w-full md:w-[320px] lg:w-[400px] h-full shrink-0">
            <Settings 
              config={config}
              onConfigChange={setConfig}
              onBack={() => setShowSettings(false)} 
            />
          </div>
        ) : (
          <Sidebar 
            selectedChatId={selectedChat?.id}
            onSelectChat={handleSelectChat} 
            onOpenSettings={() => setShowSettings(true)}
          />
        )}
      </div>

      {/* Main Panel (Chat or Placeholder) */}
      <div className="flex-1 relative h-full">
        {selectedChat ? (
          <ChatWindow 
            chat={selectedChat} 
            config={config}
            onBack={() => setSelectedChat(undefined)} 
          />
        ) : (
          <div className="hidden md:flex h-full items-center justify-center bg-nebula-chat-bg select-none">
            <div className="text-center space-y-6">
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="w-32 h-32 mx-auto bg-white dark:bg-nebula-sidebar rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/10 border border-nebula-border"
               >
                  <span className="text-nebula-primary text-5xl">🌌</span>
               </motion.div>
               <div className="space-y-1">
                 <h2 className="text-xl font-bold text-nebula-text tracking-tight">Nebula Messages</h2>
                 <p className="text-nebula-text-secondary text-sm font-medium">
                   Select a conversation to start chatting
                 </p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
