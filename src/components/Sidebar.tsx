import React, { useState } from 'react';
import { Search, Menu, Check, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Chat } from '../types';
import { MOCK_CHATS } from '../constants';

interface SidebarProps {
  onSelectChat: (chat: Chat) => void;
  selectedChatId?: string;
  onOpenSettings: () => void;
}

export default function Sidebar({ onSelectChat, selectedChatId, onOpenSettings }: SidebarProps) {
  const [search, setSearch] = useState('');

  const filteredChats = MOCK_CHATS.filter(chat => 
    chat.name.toLowerCase().includes(search.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full md:w-[320px] lg:w-[400px] h-full flex flex-col border-r border-nebula-border bg-nebula-sidebar shrink-0">
      {/* Header */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-nebula-primary rounded-lg flex items-center justify-center">
               <span className="text-white text-lg font-bold">N</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-nebula-text">Nebula</h1>
          </div>
          <button 
            onClick={onOpenSettings}
            className="p-2 hover:bg-white dark:hover:bg-nebula-bg rounded-lg transition-colors text-nebula-text-secondary shadow-sm border border-transparent hover:border-nebula-border"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nebula-text-secondary" />
          <input
            type="text"
            placeholder="Search conversations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-nebula-bg border border-nebula-border rounded-xl py-2 pl-10 pr-4 text-[14px] focus:ring-2 focus:ring-nebula-primary/20 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {filteredChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left mb-1 ${
              selectedChatId === chat.id 
                ? 'bg-nebula-primary text-white shadow-lg shadow-indigo-500/20 translate-x-1' 
                : 'hover:bg-white dark:hover:bg-nebula-bg text-nebula-text'
            }`}
          >
            <div className="relative">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-11 h-11 rounded-xl bg-gray-200 object-cover"
              />
              {chat.status === 'online' && (
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-nebula-sidebar rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className={`font-semibold truncate text-[14px] ${selectedChatId === chat.id ? 'text-white' : 'text-nebula-text'}`}>
                  {chat.name}
                </h3>
                <span className={`text-[11px] ${selectedChatId === chat.id ? 'text-white/80' : 'text-nebula-text-secondary'}`}>
                  {chat.time}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className={`truncate text-[13px] flex-1 ${selectedChatId === chat.id ? 'text-white/90' : 'text-nebula-text-secondary'}`}>
                  {chat.status === 'typing...' ? (
                    <span className="text-nebula-primary dark:text-indigo-400 font-medium italic">typing...</span>
                  ) : (
                    chat.lastMessage
                  )}
                </p>
                {chat.unreadCount > 0 && selectedChatId !== chat.id && (
                  <span className="ml-2 bg-nebula-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
                {chat.unreadCount === 0 && chat.lastMessageIsMe && (
                   <CheckCheck className={`w-3.5 h-3.5 ml-1 ${selectedChatId === chat.id ? 'text-white/80' : 'text-nebula-primary'}`} />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
