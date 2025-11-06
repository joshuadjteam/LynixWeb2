import { User } from '../types';

let USERS: Record<string, User> = {
  daradmin: {
    id: 'daradmin',
    username: 'daradmin',
    role: 'admin',
    plan: {
      name: 'Admin Suite',
      cost: 'N/A',
      details: 'Full administrative access.'
    },
    email: 'admin@lynixity.x10.bz',
    sip: 'N/A',
    billing: {
      status: 'On Time'
    }
  },
  darcodr: {
    id: 'darcodr',
    username: 'darcodr',
    role: 'user',
    plan: {
      name: 'Unlimited Suite',
      cost: '$15.99/month',
      details: 'Discounted from $15.99 (launch offer)'
    },
    email: 'joshua.kesavaruban@lynixity.x10.bz',
    sip: 'u0470055990@lynixity.x10.bz',
    billing: {
      status: 'On Time'
    }
  },
  demo: {
    id: 'demo',
    username: 'demo',
    role: 'user',
    plan: {
      name: 'Mailing',
      cost: '$5/month',
      details: 'Standard mailing plan.'
    },
    email: 'null@lynixity.x10.bz',
    sip: 'echo@iptel.org',
    billing: {
      status: 'On Time'
    }
  },
  nopay: {
    id: 'nopay',
    username: 'nopay',
    role: 'user',
    plan: {
      name: 'NoPay Demo',
      cost: '$4.99/month',
      details: 'This account is currently suspended due to non-payment.'
    },
    email: 'suspended@lynixity.x10.bz',
    sip: 'N/A',
    billing: {
      status: 'Suspended',
      owes: 49.99
    }
  }
};

let PASSWORDS: Record<string, string> = {
    daradmin: 'DJTeam2013',
    darcodr: 'DJTeam2013',
    demo: 'DJTeam2013',
    nopay: 'DJTeam2013'
};


export const authenticateUser = (username: string, password: string): User | null => {
    const user = USERS[username.toLowerCase()];
    if (user && PASSWORDS[user.id] === password) {
        return user;
    }
    return null;
}

export const getAllUsers = (): User[] => {
    return Object.values(USERS).filter(u => u.role !== 'admin');
};

export const addUser = (userData: Omit<User, 'id'>, password: string): { success: boolean, message?: string } => {
    const newId = userData.username.toLowerCase();
    if (USERS[newId]) {
        return { success: false, message: 'Username already exists.' };
    }
    const newUser: User = { ...userData, id: newId };
    USERS[newId] = newUser;
    PASSWORDS[newId] = password;
    return { success: true };
};

export const updateUser = (userId: string, updatedData: Partial<User>): { success: boolean, message?: string } => {
    if (!USERS[userId]) {
        return { success: false, message: 'User not found.' };
    }
    // Deep merge for nested objects like plan and billing
    const currentUser = USERS[userId];
    const newPlan = { ...currentUser.plan, ...updatedData.plan };
    const newBilling = { ...currentUser.billing, ...updatedData.billing };
    USERS[userId] = { ...currentUser, ...updatedData, plan: newPlan, billing: newBilling };

    return { success: true };
};

export const updateUserPassword = (userId: string, newPassword: string): { success: boolean, message?: string } => {
     if (!PASSWORDS[userId]) {
        return { success: false, message: 'User not found.' };
    }
    PASSWORDS[userId] = newPassword;
    return { success: true };
}

export const deleteUser = (userId: string): { success: boolean, message?: string } => {
    if (!USERS[userId]) {
        return { success: false, message: 'User not found.' };
    }
    if (USERS[userId].role === 'admin') {
        return { success: false, message: 'Cannot delete an admin user.' };
    }
    delete USERS[userId];
    delete PASSWORDS[userId];
    return { success: true };
};