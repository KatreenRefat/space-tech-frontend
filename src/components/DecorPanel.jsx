import logoCircleImg from '@/assets/images/logo-circle.svg';
import lightningIcon from '@/assets/icons/lightning.svg';
import wrenchIcon from '@/assets/icons/wrench.svg';
import screwdriverIcon from '@/assets/icons/screwdriver.svg';

/**
 * اللوحة الزخرفية — الدايرة البيضا بتاعة اللوجو والأدوات اللي حواليها.
 *
 * النِّسب هنا متاخدة من الديزاين: الأيقونات متظبطة بالنسبة لمربع الدايرة
 * نفسه، فبتفضل في مكانها مهما اتغير حجم الشاشة.
 */
export default function DecorPanel() {
  return (
    <div className="pointer-events-none relative z-10 hidden items-center justify-center md:flex md:w-1/2">
      <div className="relative aspect-square w-[92%] max-w-[620px]">
        <img src={logoCircleImg} alt="صلحلي" className="h-full w-full object-contain" />

        <img src={lightningIcon} alt="" className="absolute top-[4%] left-[104%] w-[14%]" />
        <img src={wrenchIcon} alt="" className="absolute top-[93%] left-[-6%] w-[24%]" />
        <img src={screwdriverIcon} alt="" className="absolute top-[88%] left-[94%] w-[14%]" />
      </div>
    </div>
  );
}
