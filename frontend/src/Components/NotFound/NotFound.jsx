// React
import React from "react";
// NotFound CSS
import "./NotFound.css";

// Import UseNavigate
import { useNavigate } from "react-router-dom";

/* ------------- Storage ------------- */
// Cookies
import Cookies from "js-cookie";

const NotFound = () => {
  // UseNavigate
  const navigate = useNavigate();

  return (
    <>
      {/* Not Found Div */}
      <div className="notfound">
        {/* Heading */}
        <h1>Oops!</h1>
        {/* H4 */}
        <h4>404 - PAGE NOT FOUND</h4>
        {/* Para */}
        <p>
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable.
        </p>
        {/* Home Page Button */}
        <button
          className="homepagebtn"
          onClick={() => {
            if (Cookies.get("token") && Cookies.get("userid")) {
              navigate("/dashboard");
            } else {
              navigate("/");
            }
          }}
        >
          GO TO HOMEPAGE
        </button>
      </div>
    </>
  );
};

export default NotFound;
