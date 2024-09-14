import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";

import Home from "../Components/Home/Home";
import Dashboard from "../Components/Dashboard/Dashboard";
import NotFound from "../Components/NotFound/NotFound";

// ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const authed = Cookies.get("token"); // get the token from cookies

  return authed ? children : <Navigate to="/" replace />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route exact path="/" element={<Home />} />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
