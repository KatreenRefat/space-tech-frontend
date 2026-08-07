import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from '@/constants/routes.js';
import PendingApproval from '@/pages/PendingApproval.jsx';

import AuthRoutes from './AuthRoutes.jsx';
import CustomerRoutes from './CustomerRoutes.jsx';
import TechnicianRoutes from './TechnicianRoutes.jsx';

export default function AppRoutes() {
  return (
    // BASE_URL is '/' in dev and '/space-tech-frontend/' in the Pages build.
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path={`${ROUTES.AUTH.ROOT}/*`} element={<AuthRoutes />} />
        <Route path={`${ROUTES.CUSTOMER.ROOT}/*`} element={<CustomerRoutes />} />
        <Route path={`${ROUTES.TECHNICIAN.ROOT}/*`} element={<TechnicianRoutes />} />
        <Route path={ROUTES.PENDING_APPROVAL} element={<PendingApproval />} />
        <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.AUTH.COVER} replace />} />
        {/* Unknown URL — send people to the entry screen instead of a blank page. */}
        <Route path="*" element={<Navigate to={ROUTES.AUTH.COVER} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
