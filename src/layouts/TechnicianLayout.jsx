import { Outlet } from 'react-router-dom';

/** Shell around every /technician page — nav and shared chrome belong here. */
export default function TechnicianLayout() {
  return (
    <div className="bg-blue-light-100 font-cairo min-h-screen p-5" dir="rtl">
      <h1 className="text-primary-500 mb-4 text-xl font-semibold">لوحة الفني</h1>
      <Outlet />
    </div>
  );
}
