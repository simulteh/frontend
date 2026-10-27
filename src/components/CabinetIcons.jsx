import React from 'react';

const Icon = ({ children, size = 20, fill = 'none' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={fill === 'none' ? 'currentColor' : 'none'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const UserIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
  </Icon>
);

export const UserFilledIcon = (props) => (
  <Icon fill="currentColor" {...props}>
    <circle cx="12" cy="8" r="4.5" />
    <path d="M3.5 21c0-4.5 3.8-7 8.5-7s8.5 2.5 8.5 7z" />
  </Icon>
);

export const LockIcon = (props) => (
  <Icon fill="currentColor" {...props}>
    <path d="M17 10h-1V7a4 4 0 0 0-8 0v3H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7-3a2 2 0 0 1 4 0v3h-4z" />
  </Icon>
);

export const CopyIcon = (props) => (
  <Icon {...props}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </Icon>
);

export const CheckIcon = (props) => (
  <Icon {...props}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);

export const PlusIcon = (props) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Icon>
);

export const BackIcon = (props) => (
  <Icon {...props}>
    <path d="M15 5l-7 7 7 7" />
  </Icon>
);

export const LinkIcon = (props) => (
  <Icon {...props}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </Icon>
);

export const EditIcon = (props) => (
  <Icon {...props}>
    <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z" />
  </Icon>
);

export const CloseIcon = (props) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const UserPlusIcon = (props) => (
  <Icon {...props}>
    <circle cx="10" cy="8" r="4" />
    <path d="M2 21c0-4 3.6-6 8-6 1.5 0 2.9.2 4 .7M19 14v6M16 17h6" />
  </Icon>
);

export const TeacherIcon = (props) => (
  <Icon fill="currentColor" {...props}>
    <path d="M12 4L1 9.5 12 15l9-4.5V16h2V9.5z" />
    <path d="M5 13.3V17c0 1.7 3.1 3 7 3s7-1.3 7-3v-3.7L12 17z" />
  </Icon>
);
