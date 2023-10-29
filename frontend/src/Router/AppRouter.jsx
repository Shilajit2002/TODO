// React
import React from "react";

/* ------------- React Router Dom ------------- */
// Router,Route,Routes
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/* ------------- Components ------------- */
// Home Component
import Home from "../Components/Home/Home";
// Dashboard Component
import Dashboard from "../Components/Dashboard/Dashboard";
// Not Found Component
import NotFound from "../Components/NotFound/NotFound";

const AppRouter = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Home Route */}
          <Route exact path="/" element={<Home />} />
          {/* Dashboard Route */}
          <Route exact path="/dashboard" element={<Dashboard />} />
          {/* Not Found Route */}
          <Route exact path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default AppRouter;
