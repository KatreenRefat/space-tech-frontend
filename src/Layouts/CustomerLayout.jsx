import { Outlet } from 'react-router-dom';

export default function CustomerLayout() {
  return (
    <div style={{ fontFamily: 'Cairo, sans-serif', padding: 20 }}>
      <h1>لوحة العميل</h1>
      <Outlet />
    </div>
  );
}