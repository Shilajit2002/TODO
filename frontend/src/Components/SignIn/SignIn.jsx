// React & UseState & UseEffect
import React, { useState } from "react";
// SignIn CSS
import "./SignIn.css";

/* ------------- Fetch ------------- */
// Axios
import axios from "axios";

import prof from "./Assets/profLogo.avif";

/* ------------- Backend Url ------------- */
// Base URL
import baseUrl from "../../Helper/BaseUrl";

/* ------------- React Router Dom ------------- */
// UseNavigate
import { useNavigate } from "react-router-dom";

/* ------------- Storage ------------- */
// Cookies
import Cookies from "js-cookie";

/* ------------- MUI Inputs ------------- */
// TextField
import TextField from "@mui/material/TextField";
// Box
import Box from "@mui/material/Box";
// Input Adorment
import InputAdornment from "@mui/material/InputAdornment";

/* ------------- MUI Icons ------------- */
// Email Icon
import EmailIcon from "@mui/icons-material/Email";
// Password Icon
import PasswordIcon from "@mui/icons-material/Password";
// Visibility Icon
import VisibilityIcon from "@mui/icons-material/Visibility";
// Visibility Off Icon
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// Icon Button
import IconButton from "@mui/material/IconButton";

/* ------------- Alerts ------------- */
// Snack Bar
import Snackbar from "@mui/material/Snackbar";
// Alert
import MuiAlert from "@mui/material/Alert";

const SignIn = () => {
  const navigate = useNavigate();
  // Password Show,Hide UseState
  const [hidePass, setHidePass] = useState({
    type: "password",
    flag: true,
  });

  // Password See & Hide Func
  const passwordFunc = () => {
    hidePass.flag
      ? setHidePass({
          type: "text",
          flag: false,
        })
      : setHidePass({
          type: "password",
          flag: true,
        });
  };

  // User UseState
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  // Input Alert UseState
  const [alert, setAlert] = useState({
    mailAlert: "",
    passAlert: "",
  });

  // Handle User Change Func
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  // Snackbar Alert UseState
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Close SnackBar Alert Func
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnack({
      ...snack,
      open: false,
    });
  };

  // Handle Form Submit Func
  const handleSignIn = (event) => {
    // Stop Reloading the Page when Submiting the Form
    event.preventDefault();

    // Check if the form is fill or not
    if (
      user.email !== "" &&
      alert.mailAlert === "" &&
      user.password !== "" &&
      alert.passAlert === ""
    ) {
      // Send to the Backend of User Form data
      axios
        .post(`${baseUrl}/api/user/login`, user)
        .then((req) => {
          // If Success then Set User Null
          setUser({
            email: "",
            password: "",
          });

          Cookies.set("token", req.data.token);
          Cookies.set("userid", req.data.userid);

          navigate("/dashboard");
        })
        .catch((err) => {
          // console.log(err);
          if (err.response) {
            // If Error then show the error message
            if (err.response.data === "User Not Registered") {
              setSnack({
                open: true,
                message: "`~` You are not registered !!",
                severity: "info",
              });
            } else if (err.response.data === "Password is Incorrect") {
              setSnack({
                open: true,
                message: "`~` Password is Incorrect !!",
                severity: "info",
              });
            }
          } else {
            setSnack({
              open: true,
              message: "Server Error !!",
              severity: "error",
            });
          }
        });
    }
    // Else show fill the form
    else {
      setSnack({
        open: true,
        message: "Please fill the form !!",
        severity: "warning",
      });
    }
  };

  return (
    <>
      {/* Main SignIn Container */}
      <div className="signinContainer">
        {/* Prof */}
        <img src={prof} alt="Logo" />
        {/* Heading */}
        <h4>SIGN IN</h4>
        {/* SignIn Form */}
        <form onSubmit={handleSignIn}>
          {/* Email Id Box */}
          <Box className="signInbox">
            {/* Email Icon */}
            <EmailIcon
              sx={{
                color: "black",
                mr: 1,
                fontSize: "1.8rem",
              }}
            />
            {/* Text Field */}
            <TextField
              label="Email Id"
              color="secondary"
              type="text"
              name="email"
              value={user.email ? user.email.trim("") : user.email}
              onChange={handleUserChange}
              className="signInInput"
              variant="outlined"
              InputProps={{
                style: {
                  color: "black",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                },
              }}
              onBlur={() => {
                if (
                  !/^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
                    user.email
                  )
                ) {
                  setAlert({
                    ...alert,
                    mailAlert: "Invalid email address !!",
                  });
                } else {
                  setAlert({
                    ...alert,
                    mailAlert: "",
                  });
                }
              }}
            />
          </Box>
          {/* Show Email Alert */}
          <p
            style={{
              height: "10px",
            }}
          >
            {alert.mailAlert}
          </p>

          {/* Password Box */}
          <Box className="signInbox">
            {/* Passowrd Icon */}
            <PasswordIcon
              sx={{
                color: "black",
                mr: 1,
                fontSize: "1.8rem",
              }}
            />
            {/* Text Field */}
            <TextField
              label="Password"
              color="secondary"
              type={hidePass.type}
              name="password"
              value={user.password ? user.password.trim("") : user.password}
              onChange={handleUserChange}
              className="signInInput"
              InputProps={{
                style: {
                  color: "black",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={passwordFunc}
                      style={{ cursor: "pointer" }}
                      edge="end"
                    >
                      {hidePass.flag ? (
                        <VisibilityOffIcon
                          sx={{ color: "black", fontSize: "1.5rem" }}
                        />
                      ) : (
                        <VisibilityIcon
                          sx={{ color: "black", fontSize: "1.5rem" }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              onBlur={() => {
                if (
                  !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+-=,./<>?;:'"[\]{}|~`])(?=.{8,})/.test(
                    user.password
                  )
                ) {
                  setAlert({
                    ...alert,
                    passAlert:
                      "Password must be 8+ characters with lowercase,nInpercase, number, and special character.",
                  });
                } else {
                  setAlert({
                    ...alert,
                    passAlert: "",
                  });
                }
              }}
            />
          </Box>
          {/* Show Password Alert */}
          <p
            style={{
              minHeight: "10px",
            }}
          >
            {alert.passAlert}
          </p>

          {/* SignnIn Submit Button */}
          <button type="submit" className="signupin">
            SignIn
          </button>
        </form>

        {/* Snack Bar Alert */}
        <Snackbar
          open={snack.open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          {/* Mui Alert */}
          <MuiAlert
            onClose={handleClose}
            severity={snack.severity}
            sx={{ width: "100%" }}
          >
            <strong>{snack.message}</strong>
          </MuiAlert>
        </Snackbar>
      </div>
    </>
  );
};

export default SignIn;
