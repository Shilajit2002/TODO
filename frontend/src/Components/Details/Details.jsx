// React & UseState & UseEffect
import React, { useState, useEffect } from "react";
// Details CSS
import "./Details.css";

/* ------------- Fetch ------------- */
// Axios
import axios from "axios";

/* ------------- Assets ------------- */
// Default Profile Pic
import profilePic from "./Assets/profilePic.png";

/* ------------- Backend Url ------------- */
// Base URL
import baseUrl from "../../Helper/BaseUrl";

/* ------------- Storage ------------- */
// Cookies
import Cookies from "js-cookie";

/* ------------- MUI Icons ------------- */
// Search Icon
import SearchIcon from "@mui/icons-material/Search";
// Upcoming Icon
import UpcomingIcon from "@mui/icons-material/Upcoming";
// Checklist Icon
import ChecklistIcon from "@mui/icons-material/Checklist";
// Previous Icon
import UndoIcon from "@mui/icons-material/Undo";
// Add Icon
import AddCircleIcon from "@mui/icons-material/AddCircle";
// Account Icon
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// Sign Out Icon
import LogoutIcon from "@mui/icons-material/Logout";
// Edit Icon
import EditIcon from "@mui/icons-material/Edit";
// Delete Icon
import DeleteIcon from "@mui/icons-material/Delete";

/* ------------- MUI Components ------------- */
// Style
import { styled } from "@mui/material/styles";
// Form Control Label
import FormControlLabel from "@mui/material/FormControlLabel";
// Switch
import Switch from "@mui/material/Switch";
// Button
import Button from "@mui/material/Button";
// TextFiled
import TextField from "@mui/material/TextField";
// Dialog
import Dialog from "@mui/material/Dialog";
// Dialog Actions
import DialogActions from "@mui/material/DialogActions";
// Dialog Content
import DialogContent from "@mui/material/DialogContent";
// Dialog Title
import DialogTitle from "@mui/material/DialogTitle";

/* ------------- MUI Structure ------------- */
// Skeleton
import Skeleton from "@mui/material/Skeleton";

/* ------------- Alerts ------------- */
// Snack Bar
import Snackbar from "@mui/material/Snackbar";
// Alert
import MuiAlert from "@mui/material/Alert";

// Material  UI Switch Styles Func
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

const Details = (props) => {
  // Take the token and userid if it is not peresent redirect to Home page
  if (!(Cookies.get("token") && Cookies.get("userid"))) {
    Cookies.remove("token");
    Cookies.remove("userid");
    window.location.href = "/";
  }

  // Take All Props
  const {
    // Active Filter UseState Props
    activeFilter,
    setActiveFilter,
    // Task UseState Props
    task,
    setTask,
    // Task Filter UseState Props
    taskFilter,
    setTaskFilter,
    // Mode UseState Props
    mode,
    setMode,
    // Task Count UseState Props
    taskCount,
    // Task List UseState Props
    taskList,
    setTaskList,
  } = props;

  /* ------------- All UseState ------------- */
  // User UseState
  const [user, setUser] = useState();
  // Per List Data UseState
  const [listData, setListData] = useState({
    name: "",
    color: "#000000",
    edit: false,
  });
  // Search UseState
  const [search, setSearch] = useState("");
  // Date Val UseState
  const [dateVal, setDateVal] = useState("");
  // Edit List UseState
  const [editList, setEditList] = useState({
    _id: "",
    count: 0,
  });
  // Snackbar Alert UseState
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  // Open List Dialog Box UseState
  const [openListDialog, setOpenListDialog] = useState(false);

  // UserEffect for get the user details
  useEffect(() => {
    // Take the Token and Userid
    const token = Cookies.get("token");
    const userid = Cookies.get("userid");

    // If token and userid present
    if (token && userid) {
      // Axios Get Request from Backend
      axios
        .get(`${baseUrl}/api/user/get-details/${userid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // Set the data of the User
          setUser(res.data);
        })
        .catch((err) => {
          // console.log(err);
          window.location.reload();
        });
    }
  }, []);

  // UserEffect for get the user list details
  useEffect(() => {
    // Take the Token and Userid
    const token = Cookies.get("token");
    const userid = Cookies.get("userid");

    // If token and userid present
    if (token && userid) {
      // Axios Get Request from Backend
      axios
        .get(`${baseUrl}/api/list/get-all-list/${userid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // Set the list data
          setTaskList(res.data);
        })
        .catch((err) => {
          // console.log(err);
          window.location.reload();
        });
    }
  }, [setTaskList]);

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

  // Active Filter Func
  const handleActiveFilterChange = (index, name, c) => {
    // Get Today Date
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // Active the Click Div Box
    setActiveFilter(index);
    // Set Date Value with Null
    setDateVal("");
    // Set Search Value with Null
    setSearch("");

    let filteredTasks = [];
    let filterName, filterCount;

    // Filter the Task as per Active Filter data
    if (task && task.taskArr.length !== 0) {
      filteredTasks = task.taskArr.filter((t) => {
        const isToday = t.date === todayDate;
        const isUpcoming = t.date > todayDate;
        const isPast = t.date < todayDate;

        if (index === 1) return isUpcoming;
        if (index === 2) return isToday;
        if (index === 3) return isPast;

        return name.toLowerCase() === t.list.toLowerCase();
      });
    }

    if (index === 1) {
      filterName = "Upcoming";
      filterCount = taskCount.upcomingCount;
    } else if (index === 2) {
      filterName = "Today";
      filterCount = taskCount.todayCount;
    } else if (index === 3) {
      filterName = "Previous";
      filterCount = taskCount.previousCount;
    } else {
      filterName = name;
      filterCount = c;
    }

    setTaskFilter({
      name: filterName,
      count: filterCount,
      filteredTasks: filteredTasks,
    });
  };

  // Handle Search Func
  const handleSearchFunc = (e) => {
    const { value } = e.target;
    // Set Search Value
    setSearch(value);
    // Set Active Filter Value with 0
    setActiveFilter(0);
    // Set Date Val with Null
    setDateVal("");

    let filteredTasks = [];

    // Filter the Task as per Task Value
    if (task && task.taskArr.length !== 0) {
      filteredTasks = task.taskArr.filter((t) =>
        t.title.toLowerCase().includes(value)
      );
    }

    // Set the Task Filter Value
    setTaskFilter({
      name: "Search",
      count: filteredTasks ? filteredTasks.length : 0,
      filteredTasks: filteredTasks,
    });

    // If the Value is null then Default Active the Today Div Box
    if (value === "") {
      handleActiveFilterChange(2);
    }
  };

  // Reverse Date Func
  const reverseDate = (d) => {
    const splitDate = d.split("-");
    const reverseDate = splitDate.reverse();
    const joinDate = reverseDate.join("-");
    return joinDate;
  };

  // Active Filter Date Func
  const handleActiveFilterDateChange = (index, d) => {
    // Active the Click Date Div Box
    setActiveFilter(index);

    let filteredTasks = [];
    let i = 0;

    // Filter the task as per Date
    if (task && task.taskArr.length !== 0) {
      filteredTasks = task.taskArr.filter((t) => {
        if (d === t.date) {
          i++;
          return t;
        }
        return null;
      });
    }

    setTaskFilter({
      name: reverseDate(d),
      count: i,
      filteredTasks: filteredTasks,
    });
  };

  // Open Dialog Func
  const handleClickOpenListDialog = () => {
    setOpenListDialog(true);
  };

  // Close Dialog Func
  const handleCloseListDialog = () => {
    setOpenListDialog(false);
    setListData({
      name: "",
      color: "#000000",
      edit: false,
    });
  };

  // List Add Func
  const handleSubmitListDialog = () => {
    // Take the Token and Userid
    const token = Cookies.get("token");
    const userid = Cookies.get("userid");

    if (token && userid) {
      // Check if the data is fill or not
      if (
        listData.name !== "" &&
        listData.name.trim("") !== "" &&
        listData.name.length <= 15
      ) {
        // Send to the Backend
        axios
          .post(`${baseUrl}/api/list/create-list/${userid}`, listData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            // If Success
            setListData({
              name: "",
              color: "#000000",
              edit: false,
            });
            //  Set List Data
            setTaskList(res.data);

            // Success Result
            setSnack({
              open: true,
              message: "** Added **",
              severity: "success",
            });
          })
          .catch((err) => {
            // Set Error
            setSnack({
              open: true,
              message: "Server Error !!",
              severity: "error",
            });
          });
      } else {
        if (listData.name.length >= 15) {
          setSnack({
            open: true,
            message: "List name conatins max. 15 letters",
            severity: "warning",
          });
        } else {
          setSnack({
            open: true,
            message: "Please fill the data !!",
            severity: "warning",
          });
        }
      }
    } else {
      window.location.href = "/";
    }
  };

  // Edit List Func
  const handleEditListDialog = () => {
    // Take the Token and Userid
    const token = Cookies.get("token");
    const userid = Cookies.get("userid");

    if (token && userid) {
      // Check if the data is fill or not
      if (
        listData.name !== "" &&
        listData.name.trim("") !== "" &&
        listData.name.length <= 15
      ) {
        // Send to the Backend
        axios
          .put(
            `${baseUrl}/api/list/edit-list/${userid}`,
            {
              name: listData.name,
              color: listData.color,
              count: editList.count,
              _id: editList._id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            // Set List Data
            setTaskList(res.data);
            // Send to Backend for Get all the Task Details
            axios
              .get(`${baseUrl}/api/task/get-all-task/${userid}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((res1) => {
                if (res1.data && res1.data.taskArr.length !== 0) {
                  const { taskArr } = res1.data;

                  let filteredTasks = [];

                  // Filter the Task as per current active list name
                  filteredTasks = taskArr.filter((t) => {
                    return listData.name.toLowerCase() === t.list.toLowerCase();
                  });

                  //  Set Task Filter Data
                  setTaskFilter({
                    ...taskFilter,
                    name: listData.name,
                    filteredTasks,
                  });

                  // Set Task
                  setTask(res1.data);
                }
              })
              .catch((err) => {
                window.location.reload();
              });
            // If Success
            setListData({
              name: "",
              color: "#000000",
              edit: false,
            });

            // Success Result
            setSnack({
              open: true,
              message: "** Updated **",
              severity: "success",
            });
          })
          .catch((err) => {
            // Error
            setSnack({
              open: true,
              message: "Server Error !!",
              severity: "error",
            });
          });
      } else {
        if (listData.name.length >= 15) {
          setSnack({
            open: true,
            message: "List name conatins max. 15 letters",
            severity: "warning",
          });
        } else {
          setSnack({
            open: true,
            message: "Please fill the data !!",
            severity: "warning",
          });
        }
      }
    } else {
      window.location.href = "/";
    }
  };

  // Delete List Func
  const handleListDelete = (lid, lc) => {
    // Take the Token and Userid
    const token = Cookies.get("token");
    const userid = Cookies.get("userid");

    if (token && userid) {
      if (lc === 0) {
        // Send to the Backend
        axios
          .delete(`${baseUrl}/api/list/delete-list/${userid}/${lid}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            // Set List Data
            setTaskList(res.data);

            // Default active the Today Div Box
            handleActiveFilterChange(2);
            // Success Result
            setSnack({
              open: true,
              message: "** Deleted **",
              severity: "success",
            });
          })
          .catch((err) => {
            // Set Error
            setSnack({
              open: true,
              message: "Server Error !!",
              severity: "error",
            });
          });
      } else {
        // Set Warning
        setSnack({
          open: true,
          message:
            "At first you need to delete the task which are included in this list !!",
          severity: "warning",
        });
      }
    } else {
      window.location.href = "/";
    }
  };

  // Handle Count Format Func
  const handleCountFormat = (c) => {
    if (c >= 100) {
      return "99+";
    }
    return c;
  };

  return (
    <>
      {/* If Token and UserId present then open Details Page */}
      {Cookies.get("token") && Cookies.get("userid") ? (
        <>
          {/* Main Details Box */}
          <div
            className="detailsBox"
            style={{
              backgroundColor: mode ? "rgb(238, 238, 238)" : "rgb(0, 11, 19)",
            }}
          >
            {/* If User Data Present */}
            {user ? (
              <>
                {/* Name Box */}
                <div
                  className="names"
                  style={{
                    backgroundColor: mode
                      ? "rgb(238, 238, 238)"
                      : "rgb(0, 11, 19)",
                  }}
                >
                  {/* Profile Pic */}
                  <img
                    src={user.pic ? user.pic : profilePic}
                    alt=""
                    style={{
                      boxShadow: mode
                        ? "rgba(0, 0, 0, 0.24) 0px 3px 8px"
                        : "rgba(83, 83, 83, 0.432) 0px 3px 8px",
                    }}
                  />
                  {/* Name */}
                  <h5
                    style={{
                      color: mode ? "black" : "white",
                    }}
                  >
                    Hey, {user.fullname.split(" ")[0].toUpperCase()}
                  </h5>
                </div>
              </>
            ) : (
              // If User Data is Not Present
              <>
                {/* Name Box */}
                <div className="names">
                  {/* Skeleton for Profile Pic */}
                  <Skeleton
                    variant="circular"
                    width={50}
                    height={50}
                    sx={{
                      mr: 1.1,
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    }}
                  />
                  {/* Skeleton for Name */}
                  <Skeleton variant="rectangular" width={150} height={30} />
                </div>
              </>
            )}

            {/* Search Bar Box */}
            <div
              className="searchBar"
              style={{
                backgroundColor: mode ? "rgb(238, 238, 238)" : "rgb(0, 11, 19)",
                boxShadow: mode
                  ? "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                  : "rgba(99, 99, 99, 0.637) 0px 1px 3px 0px,rgba(42, 90, 138, 0.568) 0px 0px 0px 1px",
              }}
            >
              {/* Search Icon */}
              <SearchIcon
                sx={{
                  color: mode ? "rgb(65, 65, 65)" : "aliceblue",
                  mr: 1,
                }}
              />
              {/* Input for Search */}
              <input
                type="search"
                name="search"
                id=""
                value={search}
                placeholder="Search"
                style={{
                  color: mode ? "rgb(32, 32, 32)" : "white",
                  "::placeholder": {
                    /* Placeholder color styles */
                    color: mode ? "rgb(65, 65, 65)" : "white",
                  },
                }}
                onChange={(e) => {
                  handleSearchFunc(e);
                }}
              />
            </div>

            {/* Task Bar */}
            <div className="tasksBar">
              {/* Heading */}
              <p
                style={{
                  color: mode ? "rgb(65, 65, 65)" : "whitesmoke",
                }}
              >
                TASKS
              </p>
              {/* Upcoming Box */}
              <div
                className={`tfilter ${activeFilter === 1 ? "active" : ""}`}
                style={{
                  color: mode ? "rgb(65, 65, 65)" : "white",
                }}
                onClick={() => handleActiveFilterChange(1)}
              >
                {/* Upcoming Icon */}
                <UpcomingIcon
                  sx={{
                    mr: 1.5,
                    color: mode ? "rgb(65, 65, 65)" : "aliceblue",
                  }}
                />
                {/* Heading */}
                <span>Upcoming</span>
                {/* Count */}
                <span>{taskCount.upcomingCount}</span>
              </div>
              {/* Today Box */}
              <div
                className={`tfilter ${activeFilter === 2 ? "active" : ""}`}
                style={{
                  color: mode ? "rgb(65, 65, 65)" : "white",
                }}
                onClick={() => handleActiveFilterChange(2)}
              >
                {/* Today Icon */}
                <ChecklistIcon
                  sx={{
                    mr: 1.5,
                    color: mode ? "rgb(65, 65, 65)" : "aliceblue",
                  }}
                />
                {/* Heading */}
                <span>Today</span>
                {/* Count */}
                <span>{taskCount.todayCount}</span>
              </div>
              {/* Previous Box */}
              <div
                className={`tfilter ${activeFilter === 3 ? "active" : ""}`}
                style={{
                  color: mode ? "rgb(65, 65, 65)" : "white",
                }}
                onClick={() => handleActiveFilterChange(3)}
              >
                {/* Previous Icon */}
                <UndoIcon
                  sx={{
                    mr: 1.5,
                    color: mode ? "rgb(65, 65, 65)" : "aliceblue",
                  }}
                />
                {/* Heading */}
                <span>Previous</span>
                {/* Count */}
                <span>{taskCount.previousCount}</span>
              </div>
              {/* Date Box */}
              <div
                className={`tfilter ${activeFilter === 4 ? "active" : ""}`}
                style={{
                  color: mode ? "rgb(65, 65, 65)" : "white",
                }}
              >
                {/* Input for Date */}
                <input
                  type="date"
                  name="dateVal"
                  id=""
                  value={dateVal}
                  onChange={(e) => {
                    setDateVal(e.target.value);
                    handleActiveFilterDateChange(4, e.target.value);
                  }}
                  style={{
                    color: mode ? "rgb(65, 65, 65)" : "white",
                  }}
                />
              </div>
            </div>

            {/* List Bar */}
            <div className="listsBar">
              {/* Heading */}
              <p
                style={{
                  color: mode ? "rgb(65, 65, 65)" : "whitesmoke",
                }}
              >
                LISTS
              </p>
              {/* If List is Present */}
              {taskList && taskList.listArr.length !== 0 ? (
                taskList.listArr.map((tl) => {
                  return (
                    // Per List Box
                    <div
                      className={`lfilter ${
                        activeFilter === tl._id ? "active" : ""
                      }`}
                      style={{
                        color: mode ? "rgb(65, 65, 65)" : "white",
                      }}
                      onClick={() =>
                        handleActiveFilterChange(tl._id, tl.name, tl.count)
                      }
                      key={tl._id}
                    >
                      {/* List Color Box */}
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "5px",
                          backgroundColor: `${tl.color}`,
                          marginRight: "15px",
                        }}
                      ></div>
                      {/* Heading */}
                      <span>{tl.name}</span>
                      {/* Edit Icon */}
                      <EditIcon
                        sx={{
                          mr: 1,
                          color: "darkorange",
                          marginLeft: "auto",
                          textAlign: "end",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          // Set list data with current list data
                          setListData({
                            name: tl.name,
                            color: tl.color,
                            edit: true,
                          });
                          // Set edit list data with current list data
                          setEditList({
                            _id: tl._id,
                            count: tl.count,
                          });
                          // Open the Dialog Box
                          handleClickOpenListDialog();
                        }}
                      />
                      {/* Delete Icon */}
                      <DeleteIcon
                        sx={{
                          mr: 1,
                          color: "red",
                          textAlign: "end",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          handleListDelete(tl._id, tl.count);
                        }}
                      />
                      {/* List Count Task */}
                      <span>{handleCountFormat(tl.count)}</span>
                    </div>
                  );
                })
              ) : (
                <>
                  {/* If No Task Present */}
                  {(taskList && taskList.listArr.length === 0) ||
                  taskList !== "" ? (
                    <>
                      <p
                        style={{
                          fontWeight: "500",
                          color: mode ? "black" : "white",
                          alignSelf: "center",
                        }}
                      >
                        No List Added `~`
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Show Skeleton Initially */}
                      {[0, 1].map((s, i) => {
                        return (
                          // Skeleton Box
                          <div className="lfilter" key={i}>
                            {/* Skeleton for List */}
                            <Skeleton
                              variant="rectangular"
                              height={25}
                              sx={{
                                width: "100%",
                                borderRadius: "5px",
                              }}
                            />
                          </div>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Down Box */}
            <div
              className="downBox"
              style={{
                backgroundColor: mode ? "rgb(238, 238, 238)" : "rgb(0, 11, 19)",
              }}
            >
              {/* Setting Box */}
              <div
                className="settings"
                style={{
                  color: mode ? "rgb(65, 65, 65)" : "white",
                }}
                onClick={() => handleClickOpenListDialog()}
              >
                {/* Add Icon */}
                <AddCircleIcon
                  sx={{
                    mr: 1.5,
                    color: mode ? "rgb(65, 65, 65)" : "aliceblue",
                  }}
                />
                {/* Heading */}
                <span>Add New List</span>
              </div>
              {/* Setting Box */}
              <div
                className="settings"
                style={{
                  color: mode ? "rgb(65, 65, 65)" : "white",
                }}
              >
                {/* Profile Icon */}
                <AccountCircleIcon
                  sx={{
                    mr: 1.5,
                    color: mode ? "rgb(65, 65, 65)" : "aliceblue",
                  }}
                />
                {/* Heading */}
                <span>Profile</span>
              </div>
              {/* Setting Box */}
              <div
                className="settings"
                onClick={() => {
                  Cookies.remove("token");
                  Cookies.remove("userid");
                  window.location.href = "/";
                }}
                style={{
                  color: mode ? "rgb(65, 65, 65)" : "white",
                }}
              >
                {/* Sign Out Icon */}
                <LogoutIcon
                  sx={{
                    mr: 1.5,
                    color: mode ? "rgb(65, 65, 65)" : "aliceblue",
                  }}
                />
                {/* Heading */}
                <span>Sign Out</span>
              </div>
              {/* Setting Box */}
              <div
                className="settings"
                style={{
                  color: mode ? "rgb(65, 65, 65)" : "white",
                }}
              >
                {/* Form Control Label for Switch */}
                <FormControlLabel
                  control={
                    // Material Switch for Light and Dark Mode
                    <MaterialUISwitch
                      defaultChecked
                      value={mode}
                      onChange={(e) => {
                        setMode(e.target.checked);
                      }}
                    />
                  }
                  // Show Label
                  label={mode ? "Light Mode" : "Dark Mode"}
                />
              </div>
            </div>

            {/* Dialog Box */}
            <Dialog open={openListDialog} onClose={handleCloseListDialog}>
              {/* Title */}
              <DialogTitle>
                {listData.edit ? "Update List" : "Add New List"}
              </DialogTitle>
              {/* Content */}
              <DialogContent>
                {/* Add List Text Filed */}
                <TextField
                  id="name"
                  label="Enter list name"
                  name="name"
                  type="text"
                  fullWidth
                  variant="standard"
                  color="primary"
                  value={listData.name}
                  onChange={(e) => {
                    setListData({
                      ...listData,
                      name: e.target.value,
                    });
                  }}
                />
                {/* Label for Color */}
                <label
                  htmlFor="color"
                  style={{
                    display: "block",
                    marginTop: "10px",
                    color: "rgb(65, 65, 65)",
                    cursor: "pointer",
                  }}
                >
                  Choose list color
                </label>
                {/* Color Picker */}
                <input
                  type="color"
                  name="color"
                  id="color"
                  value={listData.color}
                  onChange={(e) => {
                    setListData({
                      ...listData,
                      color: e.target.value,
                    });
                  }}
                  style={{
                    marginTop: "5px",
                    cursor: "pointer",
                    borderStyle: "none",
                    boxShadow:
                      "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
                  }}
                />
              </DialogContent>
              {/* Action Buton */}
              <DialogActions>
                {/* Save Button */}
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => {
                    // If Edit true then call edit func
                    if (listData.edit) {
                      handleEditListDialog();
                    }
                    // Othrwsie call add func
                    else {
                      handleSubmitListDialog();
                    }
                    handleCloseListDialog();
                  }}
                >
                  Save
                </Button>
                {/* Cancel Button */}
                <Button
                  onClick={handleCloseListDialog}
                  color="error"
                  size="small"
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

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
                {/* Message */}
                <strong>{snack.message}</strong>
              </MuiAlert>
            </Snackbar>
          </div>
        </>
      ) : (
        <>
          {/* If Token and UserId not present then reload the page */}
          {window.location.reload()}
        </>
      )}
    </>
  );
};

export default Details;
