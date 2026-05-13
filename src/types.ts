export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  mode: Theme;
  primaryColor: string;
  borderRadius: string;
  fontSize: string;
  chatBackground: string;
}

export interface Message {
  id: string;
  text?: string;
  imageUrl?: string;
  fileName?: string;
  fileSize?: string;
  timestamp: string;
  isMe: boolean;
  status: 'sent' | 'delivered' | 'read';
  reactions?: string[];
}

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageIsMe?: boolean;
  time: string;
  unreadCount: number;
  avatar: string;
  status: 'online' | 'offline' | 'typing...';
  messages: Message[];
}
