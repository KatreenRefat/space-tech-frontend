import { Outlet } from 'react-router-dom';

export default function TechnicianLayout() {
  return (
    <div style={{ fontFamily: 'Cairo, sans-serif', padding: 20 }}>
      <h1>لوحة الفني</h1>
      <Outlet />
    </div>
  );
}