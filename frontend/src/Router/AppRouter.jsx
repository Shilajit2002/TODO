// React
import React from "react";

/* ------------- React Router Dom ------------- */
// Import Router,Route,Routes
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/* ------------- Components ------------- */
// Import Home Component
import Home from "../Components/Home/Home";
// Import Dashboard Component
import Dashboard from "../Components/Dashboard/Dashboard";
const AppRouter = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Home Route */}
          <Route exact path="/" element={<Home />} />
          {/* Dashboard Route */}
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
};

export default AppRouter;
