export enum Page {
  Home = 'Home',
  Contact = 'Contact',
  SignOn = 'SignOn',
  Profile = 'Profile',
  Admin = 'Admin',
  Softphone = 'Softphone',
  LynxAI = 'LynxAI',
  Chat = 'Chat',
  LocalMail = 'LocalMail',
  Notepad = 'Notepad',
  Calculator = 'Calculator',
  Contacts = 'Contacts',
  Phone = 'Phone',
}

export enum ProfileTab {
  Info = 'Info',
  Billing = 'Billing',
}

export enum CallStatus {
    Ringing = 'ringing',
    Answered = 'answered',
    Ended = 'ended',
    Declined = 'declined',
    Missed = 'missed', // Future use
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
  localmail_enabled: boolean;
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

export interface Alert {
    sender_id: string;
    sender_username: string;
    message_snippet: string;
}

export interface LocalMailMessage {
    id: number;
    sender_id: string;
    sender_username: string;
    recipient_username: string;
    subject: string;
    body: string;
    timestamp: string;
    is_read: boolean;
}

export interface GuestSession {
    responsesLeft: number;
    resetTime: number | null;
}

export interface Contact {
    id: number;
    user_id: string;
    name: string;
    email?: string;
    phone?: string;
    notes?: string;
}

export interface Call {
    id: number;
    caller_id: string;
    caller_username: string;
    receiver_id: string;
    receiver_username: string;
    status: CallStatus;
    start_time?: string;
    end_time?: string;
    created_at: string;
}