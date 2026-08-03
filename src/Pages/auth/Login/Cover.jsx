import { useNavigate } from 'react-router-dom';
import './auth.css';

export default function Cover() {
  const navigate = useNavigate();

  return (
    <div className="auth-screen" onClick={() => navigate('/auth/phone')}>
      <div className="logo-circle">
        <h1>صَلْخِلي</h1>
      </div>
    </div>
  );
}