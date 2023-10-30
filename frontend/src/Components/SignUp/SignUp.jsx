// React & UseState & UseEffect
import React, { useState } from "react";
// SignUp CSS
import "./SignUp.css";

/* ------------- Fetch ------------- */
// Axios
import axios from "axios";

// Logo
import logo from "../../Logo/logo.webp";

/* ------------- Backend Url ------------- */
// Base URL
import baseUrl from "../../Helper/BaseUrl";

/* ------------- MUI Inputs ------------- */
// TextField
import TextField from "@mui/material/TextField";
// Box
import Box from "@mui/material/Box";
// Input Adorment
import InputAdornment from "@mui/material/InputAdornment";

/* ------------- MUI Components ------------- */
// Backdrop
import Backdrop from "@mui/material/Backdrop";

/* ------------- MUI Icons ------------- */
// Person Icon
import PersonIcon from "@mui/icons-material/Person";
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

const SignUp = () => {
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
    fullname: "",
    email: "",
    password: "",
  });

  // Input Alert UseState
  const [alert, setAlert] = useState({
    fullnameAlert: "",
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

  //  Open Loader UseState
  const [openLoader, setOpenLoader] = useState(false);

  // Handle Form Submit Func
  const handleSignUp = (event) => {
    // Stop Reloading the Page when Submiting the Form
    event.preventDefault();

    // Check if the form is fill or not
    if (
      user.fullname !== "" &&
      alert.fullnameAlert === "" &&
      user.email !== "" &&
      alert.mailAlert === "" &&
      user.password !== "" &&
      alert.passAlert === ""
    ) {
      setOpenLoader(true);

      // Send to the Backend of User Form data
      axios
        .post(`${baseUrl}/api/user/register`, user)
        .then((req) => {
          // If Success then Set User Null
          setUser({
            fullname: "",
            email: "",
            password: "",
          });

          setOpenLoader(false);

          // Success Result
          setSnack({
            open: true,
            message: "** You are successfully registered 😎",
            severity: "success",
          });
        })
        .catch((err) => {
          setOpenLoader(false);

          // If Error then show the error message
          if (err.response && err.response.data === "User Already Registered") {
            setSnack({
              open: true,
              message: "You are already registered !!",
              severity: "info",
            });
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
      {/* Main SignUp Container */}
      <div className="signupContainer">
        {/* Logo */}
        <img src={logo} alt="Logo" />
        {/* Heading */}
        <h4>SIGN UP</h4>
        {/* SignUp Form */}
        <form onSubmit={handleSignUp}>
          {/* Full Name Box */}
          <Box className="signUpbox">
            {/* Person Icon */}
            <PersonIcon
              sx={{
                color: "white",
                mr: 1,
                fontSize: "1.8rem",
              }}
            />
            {/* Text Field */}
            <TextField
              label="Full Name"
              color="warning"
              type="text"
              name="fullname"
              value={user.fullname}
              onChange={handleUserChange}
              className="signUpInput"
              variant="filled"
              InputProps={{
                style: {
                  color: "white",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                },
              }}
              onBlur={() => {
                if (user.fullname === "" || /^\s*$/.test(user.fullname)) {
                  setAlert({
                    ...alert,
                    fullnameAlert: "Please enter fullname !!",
                  });
                } else {
                  setAlert({
                    ...alert,
                    fullnameAlert: "",
                  });
                }
              }}
            />
          </Box>
          {/* Show FullName Alert */}
          <p
            style={{
              height: "10px",
            }}
          >
            {alert.fullnameAlert}
          </p>

          {/* Email Id Box */}
          <Box className="signUpbox">
            {/* Email Icon */}
            <EmailIcon
              sx={{
                color: "white",
                mr: 1,
                fontSize: "1.8rem",
              }}
            />
            {/* Text Field */}
            <TextField
              label="Email Id"
              color="warning"
              type="text"
              name="email"
              value={user.email ? user.email.trim("") : user.email}
              onChange={handleUserChange}
              className="signUpInput"
              variant="filled"
              InputProps={{
                style: {
                  color: "white",
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
          <Box className="signUpbox">
            {/* Passowrd Icon */}
            <PasswordIcon
              sx={{
                color: "white",
                mr: 1,
                fontSize: "1.8rem",
              }}
            />
            {/* Text Field */}
            <TextField
              label="Password"
              color="warning"
              type={hidePass.type}
              name="password"
              value={user.password ? user.password.trim("") : user.password}
              onChange={handleUserChange}
              className="signUpInput"
              InputProps={{
                style: {
                  color: "white",
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
                          sx={{ color: "white", fontSize: "1.5rem" }}
                        />
                      ) : (
                        <VisibilityIcon
                          sx={{ color: "white", fontSize: "1.5rem" }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="filled"
              onBlur={() => {
                if (
                  !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+-=,./<>?;:'"[\]{}|~`])(?=.{8,})/.test(
                    user.password
                  )
                ) {
                  setAlert({
                    ...alert,
                    passAlert:
                      "Password must be 8+ characters with lowercase, uppercase, number, and special character.",
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

          {/* Sign Up Submit Button */}
          <button type="submit" className="signupup">
            SignUp
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

        {/* BackDrop */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openLoader}
        >
          {/* Loader Dot */}
          <div className="loaderDot">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </Backdrop>
      </div>
    </>
  );
};

export default SignUp;
