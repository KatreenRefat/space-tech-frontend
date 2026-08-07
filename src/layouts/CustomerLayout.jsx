import { Outlet } from 'react-router-dom';

/**
 * Shell around every /customer page.
 *
 * كل شاشة عميل في الديزاين بتجيب الشريط العلوي والخلفية بتاعتها من
 * BrandShell، فالـ layout هنا مالوش أي chrome خاص بيه.
 */
export default function CustomerLayout() {
  return <Outlet />;
}
