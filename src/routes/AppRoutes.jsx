import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthRoutes from "./AuthRoutes";
import CustomerRoutes from "./CustomerRoutes";
import TechnicianRoutes from "./TechnicianRoutes";
import PendingApproval from "../Pages/PendingApproval";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main route groups */}
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="/customer/*" element={<CustomerRoutes />} />
        <Route path="/technician/*" element={<TechnicianRoutes />} />
        
        {/* Pending approval (outside auth layout) */}
        <Route path="/pending-approval" element={<PendingApproval />} />
        
        {/* Convenience redirects */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />
        <Route path="/" element={<Navigate to="/auth/" replace />} />
        
        {/* Catch-all: any unknown URL → auth cover */}
        <Route path="*" element={<Navigate to="/auth/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;