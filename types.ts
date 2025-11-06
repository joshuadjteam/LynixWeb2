export enum Page {
  Home = 'Home',
  Contact = 'Contact',
  SignOn = 'SignOn',
  Profile = 'Profile',
  Admin = 'Admin',
  Softphone = 'Softphone',
  LynxAI = 'LynxAI',
  Chat = 'Chat',
}

export enum ProfileTab {
  Info = 'Info',
  Billing = 'Billing',
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'standard' | 'trial' | 'guest';
  plan: {
    name: string;
    cost: string;
    details: string;
  };
  email: string;
  sip: string;
  billing: {
    status: 'On Time' | 'Overdue' | 'Suspended';
    owes?: number;
  };
  chat_enabled: boolean;
  ai_enabled: boolean;
}

export interface ChatMessage {
  sender: 'user' | 'gemini';
  text: string;
}

export interface DirectMessage {
    id: number;
    sender_id: string;
    recipient_id: string;
    text: string;
    timestamp: string;
}

export interface GuestSession {
    responsesLeft: number;
    resetTime: number | null;
}