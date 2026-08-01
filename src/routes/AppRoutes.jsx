import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthRoutes from "./AuthRoutes";
import CustomerRoutes from "./CustomerRoutes";
import TechnicianRoutes from "./TechnicianRoutes";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/auth/*" element={<AuthRoutes />} />

        <Route path="/customer/*" element={<CustomerRoutes />} />

        <Route
          path="/technician/*"
          element={<TechnicianRoutes />}
        />

        <Route
          path="/"
          element={<Navigate to="/auth/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;