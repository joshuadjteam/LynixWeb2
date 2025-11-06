export enum Page {
  Home = 'Home',
  Contact = 'Contact',
  SignOn = 'SignOn',
  Profile = 'Profile',
  Admin = 'Admin',
  Softphone = 'Softphone',
  LynxAI = 'LynxAI',
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
}

export interface ChatMessage {
  sender: 'user' | 'gemini';
  text: string;
}