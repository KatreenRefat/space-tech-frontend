import { useNavigate } from 'react-router-dom';
import './auth.css';
import { BigLogo, DecorLightning, DecorWrench, DecorScrewdriver } from './icons.jsx';

export default function Cover() {
  const navigate = useNavigate();

  return (
    <div className="auth-page cover-screen" onClick={() => navigate('/auth/phone')}>
      <div className="auth-bg-blob tr" />
      <div className="auth-bg-blob bl" />

      <div className="cover-content">
        <BigLogo />
        <DecorLightning />
        <DecorWrench />
        <DecorScrewdriver />
      </div>
    </div>
  );
}