import React from 'react';

export const LynixLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
    <path d="M12 2V22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 12L2 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="4" fill="url(#grad1)"/>
    <defs>
      <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style={{stopColor: 'rgb(56, 189, 248)', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: 'rgb(16, 185, 129)', stopOpacity: 1}} />
      </radialGradient>
    </defs>
  </svg>
);

export const QuestionMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9.00005C8.228 7.50005 9.471 6.25705 10.971 6.25705C12.471 6.25705 13.714 7.50005 13.714 9.00005C13.714 9.94805 13.114 10.7671 12.286 11.2421C11.457 11.7171 11 12.5511 11 13.5001V14.0001" />
        <path d="M11 17.0001H11.009" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        <circle cx="12" cy="12" r="10" />
    </svg>
);

export const YouTubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.411 0 5.846 0 12s.488 8.589 4.385 8.816c3.6.245 11.626.246 15.23 0C23.512 20.589 24 18.154 24 12s-.488-8.589-4.385-8.816zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);

export const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-1-6.7-2.91-1.87-1.9-2.86-4.58-2.6-7.23.25-2.64 1.86-4.96 4.09-6.31 2.2-1.34 4.66-1.48 6.96-.38 1.29.61 2.4 1.51 3.19 2.68.03-.01.06-.02.09-.04V.02z"/>
    </svg>
);

export const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.441c-3.171 0-3.535.012-4.774.069-2.694.123-3.974 1.403-4.1 4.1-.057 1.239-.068 1.597-.068 4.774s.011 3.535.068 4.774c.125 2.694 1.405 3.974 4.1 4.1 1.239.057 1.603.068 4.774.068s3.535-.011 4.774-.068c2.694-.124 3.974-1.405 4.1-4.1.057-1.239.068-1.597.068-4.774s-.011-3.535-.068-4.774c-.125-2.694-1.405-3.974-4.1-4.1-1.239-.057-1.603-.068-4.774-.068z"/>
        <path d="M12 6.845c-2.84 0-5.155 2.315-5.155 5.155s2.315 5.155 5.155 5.155 5.155-2.315 5.155-5.155S14.84 6.845 12 6.845zm0 8.868c-2.054 0-3.713-1.659-3.713-3.713s1.659-3.713 3.713-3.713 3.713 1.659 3.713 3.713-1.659 3.713-3.713 3.713z"/>
        <circle cx="16.95" cy="7.05" r="1.25"/>
    </svg>
);

export const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

export const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const BillingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

export const AIIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l-3 3m6 0l-3 3M9 7a5 5 0 0110 0v2a5 5 0 01-10 0V7z" />
    </svg>
);

export const AdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);