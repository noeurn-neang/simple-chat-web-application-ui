import { Chat } from './types';

export const REACTION_EMOJIS = ['👍', '❤️', '🔥', '😂', '😮', '😢', '👏'];

export const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    name: 'Alice Cooper',
    lastMessage: 'Hey! Are we still on for lunch?',
    lastMessageIsMe: false,
    time: '14:32',
    unreadCount: 2,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    status: 'online',
    messages: [
      { id: 'm1', text: 'Hey!', timestamp: '14:30', isMe: false, status: 'read', reactions: ['👍'] },
      { id: 'm2', text: 'Are we still on for lunch?', timestamp: '14:32', isMe: false, status: 'read' },
      { 
        id: 'm1_img', 
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop', 
        text: 'Look at this place! 🍔',
        timestamp: '14:35', 
        isMe: false, 
        status: 'read',
        reactions: ['😋', '🔥']
      },
    ],
  },
  {
    id: '2',
    name: 'Tech Updates',
    lastMessage: 'New version of React is out!',
    lastMessageIsMe: false,
    time: '12:05',
    unreadCount: 0,
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Tech',
    status: 'offline',
    messages: [
      { id: 'm3', text: 'New version of React is out!', timestamp: '12:05', isMe: false, status: 'read' },
      { 
        id: 'm3_file', 
        fileName: 'react_v19_release_notes.pdf', 
        fileSize: '4.2 MB',
        timestamp: '12:06', 
        isMe: false, 
        status: 'read' 
      },
    ],
  },
  {
    id: '3',
    name: 'Bob Smith',
    lastMessage: 'I sent you the project files.',
    lastMessageIsMe: true,
    time: 'Yesterday',
    unreadCount: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    status: 'online',
    messages: [
      { id: 'm4', text: 'I sent you the project files.', timestamp: 'Yesterday', isMe: false, status: 'read' },
    ],
  },
  {
    id: '4',
    name: 'Design Team',
    lastMessage: 'The new logo looks great.',
    lastMessageIsMe: false,
    time: 'Mon',
    unreadCount: 5,
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Design',
    status: 'typing...',
    messages: [
      { id: 'm5', text: 'The new logo looks great.', timestamp: 'Mon', isMe: false, status: 'read' },
    ],
  },
   {
    id: '5',
    name: 'James Wilson',
    lastMessage: 'Can we reschedule our meeting?',
    lastMessageIsMe: true,
    time: 'Sun',
    unreadCount: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    status: 'offline',
    messages: [
       { id: 'm6', text: 'Can we reschedule our meeting?', timestamp: 'Sun', isMe: false, status: 'read' },
    ],
  },
];
