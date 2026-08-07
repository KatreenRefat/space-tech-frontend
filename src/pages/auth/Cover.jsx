import { useNavigate } from 'react-router-dom';

import CornerBlobs from '@/components/CornerBlobs.jsx';
import { ROUTES } from '@/constants/routes.js';
import logoImg from '@/assets/images/logo.svg';
import lightningIcon from '@/assets/icons/lightning.svg';
import wrenchIcon from '@/assets/icons/wrench.svg';
import screwdriverIcon from '@/assets/icons/screwdriver.svg';

/** شاشة البداية — اللوجو والأدوات حواليه، وأي كليك بيوديك على تسجيل الدخول. */
export default function Cover() {
  const navigate = useNavigate();

  return (
    <div
      dir="rtl"
      className="bg-blue-light-200 font-cairo relative flex min-h-screen w-full cursor-pointer items-center justify-center overflow-hidden"
      onClick={() => navigate(ROUTES.AUTH.PHONE)}
    >
      <CornerBlobs corners={['top-right', 'bottom-left']} />

      {/* المربع ده هو المرجع اللي الأيقونات متظبطة بالنسبة له. */}
      <div className="relative z-10 aspect-square w-[min(64%,85vh,950px)]">
        <img
          src={logoImg}
          alt="صلحلي"
          className="absolute top-[33%] left-[34%] h-[35%] w-[31%] object-contain"
        />

        <img src={lightningIcon} alt="" className="absolute top-[33%] left-[1%] w-[12%]" />
        <img src={screwdriverIcon} alt="" className="absolute top-[55%] left-[89%] w-[9%]" />
        <img src={wrenchIcon} alt="" className="absolute top-[82%] left-[52%] w-[17%]" />
      </div>
    </div>
  );
}
