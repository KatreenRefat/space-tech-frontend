import { Routes, Route } from "react-router-dom";

import Login from "../Pages/auth/Login/Login";
import Register from "../Pages/auth/Register/Register";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Routes>
  );
}

export default AuthRoutes;