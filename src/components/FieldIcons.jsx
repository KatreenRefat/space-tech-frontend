/* Inline field icons for the signup form — small enough that a network request
   per glyph would cost more than the markup does. */

export const PersonIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5Z" />
  </svg>
);

export const PinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z" />
  </svg>
);

export const ArrowIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="m3 11 18-8-8 18-2-8-8-2Z" />
  </svg>
);

export const WrenchIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 6.5a4.5 4.5 0 0 1-6.4 4.1L8 18.2a2 2 0 1 1-2.8-2.8l7.6-7.6A4.5 4.5 0 1 1 22 6.5Z" />
  </svg>
);

export const IdIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm4 4a2 2 0 1 1-2 2 2 2 0 0 1 2-2Zm-3.5 8a3.5 3.5 0 0 1 7 0Zm9-6h7v1.5h-7Zm0 3h7V16h-7Z" />
  </svg>
);

export const UploadIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 3 7 8h3v7h4V8h3ZM5 19h14v2H5Z" />
  </svg>
);

export const ChevronDownIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const PhoneIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1Z" />
  </svg>
);

export const CameraIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.3-2h7.9l1.3 2h2.3A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5Z" />
    <circle cx="12" cy="13" r="3.6" />
  </svg>
);
