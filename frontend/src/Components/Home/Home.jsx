// React
import React from "react";
// Home CSS
import "./Home.css";
import SignUp from "../SignUp/SignUp";
import SignIn from "../SignIn/SignIn";

const Home = () => {
  return (
    <>
      <div className="homeBox">
        <h1 className="heading">Welcome Your ToDoMonk</h1>
        <div className="userBox">
          <div className="left">
            <SignUp/>
          </div>
          <div className="right">
            <SignIn/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
