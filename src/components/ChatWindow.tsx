import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Paperclip, Smile, Phone, Search, ChevronLeft, CheckCheck, File, Download, X, Trash2, Edit2, CheckCircle2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Chat, Message, ThemeConfig } from '../types';
import { REACTION_EMOJIS } from '../constants';

interface ChatWindowProps {
  chat?: Chat;
  onBack: () => void;
  config: ThemeConfig;
}

export default function ChatWindow({ chat: initialChat, onBack, config }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialChat?.messages || []);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, messageId: string } | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialChat) {
      setMessages(initialChat.messages);
    }
  }, [initialChat]);

  const toggleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const exists = reactions.includes(emoji);
        return {
          ...msg,
          reactions: exists 
            ? reactions.filter(r => r !== emoji)
            : [...reactions, emoji]
        };
      }
      return msg;
    }));
  };

  const handleContextMenu = (e: React.MouseEvent, messageId: string) => {
    e.preventDefault();
    if (selectionMode) return;
    setContextMenu({ x: e.clientX, y: e.clientY, messageId });
  };

  const closeContextMenu = () => setContextMenu(null);

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    closeContextMenu();
  };

  const deleteSelected = () => {
    setMessages(prev => prev.filter(m => !selectedIds.has(m.id)));
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const startEditing = (id: string) => {
    const msg = messages.find(m => m.id === id);
    if (msg && msg.text) {
      setEditingId(id);
      setInputText(msg.text);
    }
    closeContextMenu();
  };

  const cancelEditing = () => {
    setEditingId(null);
    setInputText('');
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!initialChat) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-nebula-chat-bg bg-opacity-20">
        <div className="bg-black/5 dark:bg-white/5 px-4 py-1.5 rounded-full text-nebula-text-secondary text-[14px]">
          Select a chat to start messaging
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    if (editingId) {
      setMessages(prev => prev.map(m => 
        m.id === editingId ? { ...m, text: inputText } : m
      ));
      setEditingId(null);
    } else {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        status: 'sent'
      };
      setMessages(prev => [...prev, newMessage]);
    }
    
    setInputText('');
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col md:relative md:flex-1 md:h-full bg-nebula-chat-bg transition-all duration-300 overflow-hidden`}
      onClick={closeContextMenu}
    >
      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[100] bg-white dark:bg-nebula-sidebar border border-nebula-border rounded-2xl shadow-2xl overflow-hidden p-1.5 min-w-[160px]"
            style={{ 
              top: Math.min(contextMenu.y, window.innerHeight - 150), 
              left: Math.min(contextMenu.x, window.innerWidth - 170) 
            }}
          >
            <button 
              onClick={() => {
                const msg = messages.find(m => m.id === contextMenu.messageId);
                if (msg && msg.text) navigator.clipboard.writeText(msg.text);
                closeContextMenu();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
            >
              <Copy className="w-4 h-4 text-nebula-text-secondary" />
              <span className="text-[13px] font-semibold text-nebula-text">Copy Text</span>
            </button>
            <button 
              onClick={() => {
                const msg = messages.find(m => m.id === contextMenu.messageId);
                if (msg?.isMe) startEditing(contextMenu.messageId);
              }}
              disabled={!messages.find(m => m.id === contextMenu.messageId)?.isMe}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-left disabled:opacity-30"
            >
              <Edit2 className="w-4 h-4 text-nebula-text-secondary" />
              <span className="text-[13px] font-semibold text-nebula-text">Edit Message</span>
            </button>
            <button 
              onClick={() => {
                setSelectionMode(true);
                setSelectedIds(new Set([contextMenu.messageId]));
                closeContextMenu();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
            >
              <CheckCircle2 className="w-4 h-4 text-nebula-text-secondary" />
              <span className="text-[13px] font-semibold text-nebula-text">Select</span>
            </button>
            <div className="h-px bg-nebula-border/50 my-1 mx-1" />
            <button 
              onClick={() => deleteMessage(contextMenu.messageId)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-500/10 rounded-xl transition-colors text-left group"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span className="text-[13px] font-semibold text-red-500">Delete</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setPreviewImage(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setPreviewImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={previewImage}
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              alt="Preview"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white/80 dark:bg-nebula-sidebar/80 backdrop-blur-md border-b border-nebula-border p-3 md:p-4 flex items-center gap-3 shrink-0 sticky top-0 z-20">
        {selectionMode ? (
          <>
            <button onClick={() => setSelectionMode(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
              <X className="w-5 h-5 text-nebula-text-secondary" />
            </button>
            <div className="flex-1">
              <span className="text-[15px] font-bold text-nebula-text">{selectedIds.size} Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={deleteSelected}
                disabled={selectedIds.size === 0}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-30"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <>
            <button onClick={onBack} className="md:hidden p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
              <ChevronLeft className="w-5 h-5 text-nebula-primary" />
            </button>
            <div className="relative">
              <img
                src={initialChat.avatar}
                alt={initialChat.name}
                className="w-10 h-10 md:w-11 md:h-11 rounded-xl cursor-pointer object-cover shadow-sm ring-1 ring-nebula-border"
              />
              {initialChat.status === 'online' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-nebula-sidebar rounded-full" />
              )}
            </div>
            <div className="flex-1 cursor-pointer">
              <h2 className="font-bold text-[15px] md:text-[17px] leading-tight text-nebula-text tracking-tight">{initialChat.name}</h2>
              <p className="text-[12px] md:text-[13px] text-nebula-text-secondary font-medium">
                 {initialChat.status === 'online' ? (
                    <span className="text-emerald-500">Active now</span>
                 ) : initialChat.status === 'typing...' ? (
                    <span className="text-nebula-primary animate-pulse italic">typing...</span>
                 ) : (
                    'Offline'
                 )}
              </p>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <div className="hidden sm:flex items-center bg-black/5 dark:bg-white/5 rounded-xl p-1 gap-1">
                <button className="p-2 hover:bg-white dark:hover:bg-nebula-bg rounded-lg text-nebula-text-secondary transition-all">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-white dark:hover:bg-nebula-bg rounded-lg text-nebula-text-secondary transition-all">
                  <Search className="w-4 h-4" />
                </button>
              </div>
              <button 
                className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-nebula-text-secondary transition-all"
                onClick={() => setSelectionMode(!selectionMode)}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Messages area */}
      <div 
        className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 flex flex-col gap-3 custom-scrollbar overflow-x-hidden relative"
      >
         {/* Background Pattern */}
         {config.chatBackground && (
           <div 
             className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] pointer-events-none"
             style={{ 
               backgroundImage: `url('${config.chatBackground}')`,
               backgroundColor: 'transparent'
             }}
           />
         )}
         
         <div className="flex-1" />
         
          <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full relative z-10 px-2 sm:px-4">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'} relative group/row transition-all duration-200 py-1 ${
                  selectionMode ? 'cursor-pointer' : ''
                }`}
                onClick={() => selectionMode && toggleSelect(msg.id)}
                onContextMenu={(e) => handleContextMenu(e, msg.id)}
              >
                {/* Full-width selection highlight */}
                {selectionMode && (
                  <div className={`absolute -inset-y-1 -inset-x-2 sm:-inset-x-4 transition-all duration-200 pointer-events-none rounded-xl ${
                    selectedIds.has(msg.id) 
                      ? 'bg-nebula-primary/[0.08] dark:bg-nebula-primary/[0.12] border-y border-nebula-primary/20' 
                      : 'group-hover/row:bg-black/5 dark:group-hover/row:bg-white/5 opacity-0 group-hover/row:opacity-100'
                  }`} />
                )}

                <motion.div
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`chat-bubble p-1.5 group/msg relative transition-all ${
                    selectionMode && selectedIds.has(msg.id) 
                      ? 'ring-1.5 ring-nebula-primary scale-[0.985] shadow-lg shadow-nebula-primary/10' 
                      : ''
                  } ${msg.imageUrl ? 'bg-transparent shadow-none border-none max-w-[90%] sm:max-w-md' : msg.isMe ? 'chat-bubble-out' : 'chat-bubble-in'}`}
                >
                  {/* Reaction Picker on Hover */}
                  {!selectionMode && (
                    <div className={`absolute -top-12 ${msg.isMe ? 'right-0' : 'left-0'} opacity-0 group-hover/msg:opacity-100 transition-all duration-200 pointer-events-none group-hover/msg:pointer-events-auto z-30 pt-4`}>
                      <motion.div 
                        initial={{ scale: 0.8, y: 5 }}
                        whileHover={{ scale: 1 }}
                        className="bg-white dark:bg-nebula-sidebar border border-nebula-border shadow-xl rounded-full px-2 py-1.5 flex gap-1.5 scale-90 group-hover/msg:scale-100 transition-transform origin-bottom"
                      >
                        {REACTION_EMOJIS.map(emoji => (
                          <motion.button 
                            key={emoji}
                            whileHover={{ scale: 1.5, y: -5 }}
                            whileTap={{ scale: 0.8 }}
                            className="text-[18px] px-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleReaction(msg.id, emoji);
                            }}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </motion.div>
                    </div>
                  )}

                  {msg.imageUrl && (
                    <div className={`p-1.5 rounded-2xl shadow-lg relative cursor-zoom-in group ${msg.isMe ? 'bg-nebula-msg-out' : 'bg-nebula-msg-in border border-nebula-border/50'}`}>
                      <img 
                        src={msg.imageUrl} 
                        className="rounded-xl w-full max-h-80 object-cover" 
                        alt="Shared content" 
                        onClick={() => setPreviewImage(msg.imageUrl!)}
                      />
                      {msg.text && (
                        <p className={`px-2 py-2 text-[14px] leading-relaxed ${msg.isMe ? 'text-white' : 'text-nebula-text'}`}>{msg.text}</p>
                      )}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full pointer-events-none">
                         <span className="text-[10px] uppercase font-bold tracking-wider text-white">
                          {msg.timestamp}
                        </span>
                        {msg.isMe && (
                          <span className={`${msg.status === 'read' ? 'text-white' : 'text-white/40'}`}>
                              <CheckCheck className="w-3 h-3" />
                           </span>
                        )}
                      </div>
                    </div>
                  )}

                  {msg.fileName && (
                    <div className={`flex items-center gap-3 p-3 rounded-xl border border-nebula-border/50 ${msg.isMe ? 'bg-nebula-primary/10' : 'bg-white/50 dark:bg-black/20'}`}>
                      <div className="w-10 h-10 rounded-lg bg-nebula-primary/10 flex items-center justify-center text-nebula-primary shrink-0">
                        <File className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[14px] font-bold truncate ${msg.isMe ? 'text-nebula-primary' : 'text-nebula-text'}`}>{msg.fileName}</p>
                        <p className="text-[11px] text-nebula-text-secondary font-medium tracking-tight uppercase opacity-60">{msg.fileSize}</p>
                      </div>
                      <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-nebula-text-secondary">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {!msg.imageUrl && !msg.fileName && (
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                  )}

                  {!msg.imageUrl && (
                    <div className={`flex items-center justify-end gap-1.5 mt-1 -mr-1`}>
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${msg.isMe ? 'text-white/70' : 'text-nebula-text-secondary/60'}`}>
                        {msg.timestamp}
                      </span>
                      {msg.isMe && (
                        <span className={`${msg.status === 'read' ? 'text-white' : 'text-white/40'}`}>
                            <CheckCheck className="w-3 h-3" />
                         </span>
                      )}
                    </div>
                  )}

                  <AnimatePresence mode="popLayout">
                    {msg.reactions && msg.reactions.length > 0 && (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 10 }}
                        className={`absolute -bottom-3 ${msg.isMe ? 'right-2' : 'left-2'} flex gap-1 z-20`}
                      >
                        {msg.reactions.map((emoji, i) => (
                          <motion.button 
                            layout
                            key={i} 
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleReaction(msg.id, emoji);
                            }}
                            className="bg-white dark:bg-nebula-sidebar border border-nebula-border rounded-full px-1.5 py-0.5 text-[12px] shadow-sm flex items-center justify-center transition-transform"
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Selection Indicator Column (Aligned Right) */}
                {selectionMode && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 z-40">
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-md transition-all duration-300 ${
                        selectedIds.has(msg.id) 
                          ? 'bg-nebula-primary border-nebula-primary scale-110' 
                          : 'border-nebula-border bg-white dark:bg-nebula-sidebar scale-100'
                      }`}
                    >
                      {selectedIds.has(msg.id) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <CheckCheck className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>

      {/* Input area */}
      <div className="bg-white/80 dark:bg-nebula-sidebar/80 backdrop-blur-md p-3 md:p-5 flex flex-col gap-2 shrink-0 border-t border-nebula-border">
        {editingId && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-nebula-primary/5 rounded-xl border border-nebula-primary/20 mb-1">
            <div className="flex items-center gap-2">
              <Edit2 className="w-3 h-3 text-nebula-primary" />
              <span className="text-[12px] font-bold text-nebula-primary">Editing Message</span>
            </div>
            <button onClick={cancelEditing} className="p-1 hover:bg-nebula-primary/10 rounded-lg transition-colors">
              <X className="w-4 h-4 text-nebula-primary" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex-1 flex items-center bg-black/5 dark:bg-white/5 border border-nebula-border/50 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-nebula-primary/20 transition-all shadow-inner">
            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl text-nebula-text-secondary transition-colors mr-1">
              <Smile className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder={editingId ? "Update your message..." : "Type your message..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent border-none outline-none py-1.5 text-[15px] text-nebula-text font-medium placeholder:text-nebula-text-secondary/40"
            />
            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl text-nebula-text-secondary transition-colors ml-1">
               <Paperclip className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={handleSend}
            className={`p-3.5 rounded-2xl transition-all flex items-center justify-center ${
              inputText.trim() 
                ? 'bg-nebula-primary text-white scale-100 shadow-[0_8px_30px_rgb(79,70,229,0.3)]' 
                : 'text-nebula-text-secondary bg-black/5 dark:bg-white/5 opacity-50 cursor-not-allowed'
            }`}
          >
            <Send className={`w-5 h-5 ${inputText.trim() ? 'translate-x-0.5' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
