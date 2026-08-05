import logoSvg from '../../../assets/logo.svg';
import lightningSvg from '../../../assets/lightning.svg';
import wrenchSvg from '../../../assets/wrench.svg';
import screwdriverSvg from '../../../assets/screwdriver.svg';

/* Main logo from your designer SVG file (includes white circle + text) */
export const BigLogo = () => (
  <img src={logoSvg} alt="صَلْخِلي" className="auth-logo-img" />
);

/* Decorative floating icons using your asset files */
export const DecorLightning = () => (
  <img src={lightningSvg} alt="" className="floating-icon lightning" />
);

export const DecorWrench = () => (
  <img src={wrenchSvg} alt="" className="floating-icon wrench" />
);

export const DecorScrewdriver = () => (
  <img src={screwdriverSvg} alt="" className="floating-icon screwdriver" />
);

/* Small inline icons for top-bar / greetings */
export const LightningIcon = () => (
  <svg viewBox="0 0 24 24" fill="#f76c0c">
    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
  </svg>
);

export const WrenchIcon = () => (
  <svg className="decor-icon decor-wrench" viewBox="0 0 24 24" fill="none" stroke="#1b2a4a" strokeWidth="1.5">
    <path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2-2 2.5-2.5z" />
  </svg>
);

export const ScrewdriverIcon = () => (
  <svg className="decor-icon decor-screwdriver" viewBox="0 0 24 24" fill="none" stroke="#f76c0c" strokeWidth="1.5">
    <path d="M3 21l6-6M14 3l7 7-3 3-7-7 3-3zM11 6l-4 4" />
  </svg>
);

export const HouseLogoSmall = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#1b2a4a" strokeWidth="1.8">
    <path d="M3 11l9-7 9 7" />
    <path d="M5 10v10h14V10" />
  </svg>
);