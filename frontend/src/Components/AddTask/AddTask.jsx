// React & UseState & UseEffect
import React, { useState, useEffect } from "react";
// AddTask CSS
import "./AddTask.css";

/* ------------- Fetch ------------- */
// Axios
import axios from "axios";

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
// Input Adorment
import InputAdornment from "@mui/material/InputAdornment";
// Menu Item
import MenuItem from "@mui/material/MenuItem";
// Select
import Select from "@mui/material/Select";
// Form Control
import FormControl from "@mui/material/FormControl";
// Pink Color
import { pink } from "@mui/material/colors";
// Checkbox
import Checkbox from "@mui/material/Checkbox";

/* ------------- MUI Structure ------------- */
// Skeleton
import Skeleton from "@mui/material/Skeleton";

/* ------------- Alerts ------------- */
// Snack Bar
import Snackbar from "@mui/material/Snackbar";
// Alert
import MuiAlert from "@mui/material/Alert";

const AddTask = (props) => {
  // Take the token and userid if it is not peresent redirect to Home page
  if (!(Cookies.get("token") && Cookies.get("userid"))) {
    Cookies.remove("token");
    Cookies.remove("userid");
    window.location.href = "/";
  }

  const {
    mode,
    createTask,
    setCreateTask,
    editTask,
    setEditTask, // Task List UseState Props
    taskList,
    setTaskList,
    task,
    setTask,
    setTaskFilter,
    setTaskCount,
    activeFilter,
    setActiveFilter,
  } = props;

  const handleCreateTaskChange = (e) => {
    const { name, value } = e.target;

    setCreateTask({
      ...createTask,
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

  const handleSubTaskChange = (e, i) => {
    const updateSubtask = { ...createTask };
    updateSubtask.subtask[i] = e.target.value;
    setCreateTask(updateSubtask);
  };

  const addSubTask = () => {
    const updateSubtask = { ...createTask };
    updateSubtask.subtask.push("");
    setCreateTask(updateSubtask);
  };

  const deleteSubTask = (i) => {
    const updateSubtask = { ...createTask };
    updateSubtask.subtask.splice(i, 1);
    setCreateTask(updateSubtask);
  };

  const handleCountFormat = (c) => {
    if (c >= 100) {
      return "99+";
    }
    return c;
  };

  const allList = () => {
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
  };

  const countFunc = (res) => {
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (res.data && res.data.taskArr.length !== 0) {
      const { taskArr } = res.data;

      let upcomingCount = 0;
      let previousCount = 0;
      let todayCount = 0;

      // Count tasks based on dates
      taskArr.forEach((task) => {
        if (task.date > todayDate) {
          upcomingCount++;
        } else if (task.date < todayDate) {
          previousCount++;
        } else {
          todayCount++;
        }
      });

      // Update task counts
      setTaskCount({
        upcomingCount: handleCountFormat(upcomingCount),
        previousCount: handleCountFormat(previousCount),
        todayCount: handleCountFormat(todayCount),
      });

      // API Call to get filter data
      if (activeFilter !== 1 && activeFilter !== 2 && activeFilter !== 3 && activeFilter !== 4) {
        const token = Cookies.get("token");
        const userid = Cookies.get("userid");

        axios
          .get(`${baseUrl}/api/list/get-per-list/${userid}/${activeFilter}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res1) => {
            const filterName = res1.data.name;
            const filterCount = res1.data.count;

            // Filter tasks based on the retrieved filter name
            const filteredTasks = taskArr.filter((t) => {
              return filterName.toLowerCase() === t.list.toLowerCase();
            });

            // Update task filter and perform subsequent actions
            setTaskFilter({
              name: filterName,
              count: filterCount,
              filteredTasks: filteredTasks,
            });

            // Perform additional actions with filtered tasks here
          })
          .catch((err)=>{
            window.location.reload();
          });
      } else {
        // Handle standard filters (Upcoming, Today, Previous)
        let filteredTasks = [];
        let filterName, filterCount;

        if (activeFilter === 1) {
          filterName = "Upcoming";
          filterCount = upcomingCount;
          filteredTasks = taskArr.filter((t) => t.date > todayDate);
        } else if (activeFilter === 2) {
          filterName = "Today";
          filterCount = todayCount;
          filteredTasks = taskArr.filter((t) => t.date === todayDate);
        } else if (activeFilter === 3) {
          filterName = "Previous";
          filterCount = previousCount;
          filteredTasks = taskArr.filter((t) => t.date < todayDate);
        }

        // Update task filter and perform subsequent actions
        setTaskFilter({
          name: filterName,
          count: filterCount,
          filteredTasks: filteredTasks,
        });

        // Perform additional actions with filtered tasks here
      }

      // Reset other state variables
      setTask(res.data);
      setCreateTask({
        title: "",
        description: "",
        list: "",
        date: "",
        subtask: [],
        done: false,
      });
      setEditTask(false);
    }
  };

  // List Add Func
  const handleSubmitTask = () => {
    // Take the Token and Userid
    const token = Cookies.get("token");
    const userid = Cookies.get("userid");

    if (token && userid) {
      // Check if the data is fill or not
      if (
        createTask.title !== "" &&
        createTask.description !== "" &&
        createTask.list !== "" &&
        createTask.date !== ""
      ) {
        // Send to the Backend
        axios
          .post(`${baseUrl}/api/task/create-task/${userid}`, createTask, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            allList();
            countFunc(res);

            // Success Result
            setSnack({
              open: true,
              message: "** Task Added **",
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
        setSnack({
          open: true,
          message: "Please fill the data !!",
          severity: "warning",
        });
      }
    } else {
      window.location.href = "/";
    }
  };

  const handleEditTask = () => {
    // Take the Token and Userid
    const token = Cookies.get("token");
    const userid = Cookies.get("userid");

    if (token && userid) {
      // Check if the data is fill or not
      if (
        createTask.title !== "" &&
        createTask.description !== "" &&
        createTask.list !== "" &&
        createTask.date !== ""
      ) {
        // Send to the Backend
        axios
          .put(`${baseUrl}/api/task/edit-task/${userid}`, createTask, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            allList();
            countFunc(res);

            // Success Result
            setSnack({
              open: true,
              message: "** Task Updated **",
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
        setSnack({
          open: true,
          message: "Please fill the data !!",
          severity: "warning",
        });
      }
    } else {
      window.location.href = "/";
    }
  };

  const handleDeleteTask = () => {
    // Take the Token and Userid
    const token = Cookies.get("token");
    const userid = Cookies.get("userid");

    if (token && userid) {
      // Check if the data is fill or not
      if (createTask._id) {
        // Send to the Backend
        axios
          .delete(
            `${baseUrl}/api/task/delete-task/${userid}/${createTask._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            allList();
            countFunc(res);

            // Success Result
            setSnack({
              open: true,
              message: "** Task Deleted **",
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
      }
    } else {
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* If Token and UserId present then open Details Page */}
      {Cookies.get("token") && Cookies.get("userid") ? (
        <>
          <div
            className="addTaskBox"
            style={{
              backgroundColor: mode ? "rgb(238, 238, 238)" : "rgb(0, 11, 19)",
            }}
          >
            <h5
              style={{
                alignSelf: "flex-start",
                margin: "10px",
                marginLeft: "15px",
                color: mode ? "rgb(65, 65, 65)" : "white",
              }}
            >
              {editTask ? "Update Task" : "Create Task"}
            </h5>
            <TextField
              label="Title"
              color="warning"
              type="text"
              name="title"
              value={createTask.title}
              onChange={handleCreateTaskChange}
              variant="filled"
              style={{
                width: "90%",
                margin: "10px 0",
                backgroundColor: mode ? "" : "white",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
              }}
              InputLabelProps={{
                style: {
                  color: "black", // Set the initial placeholder color to white
                },
              }}
              InputProps={{
                style: {
                  color: "black",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                },
              }}
            />
            <textarea
              name="description"
              id=""
              placeholder="Description"
              value={createTask.description}
              onChange={handleCreateTaskChange}
              style={{
                color: "black",
                backgroundColor: mode ? "#D9D9D9" : "white",
                fontWeight: "400",
                letterSpacing: "0.5px",
              }}
            />
            {/* Select Form */}
            <FormControl
              className="listInput"
              sx={{
                backgroundColor: mode ? "" : "white",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
              }}
            >
              {/* Select */}
              <Select
                id="demo-simple-select"
                name="list"
                value={createTask.list || "Select List"}
                onChange={handleCreateTaskChange}
                variant="filled"
                color="warning"
                sx={{
                  color: "black",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                  backgroundColor: mode ? "" : "white",
                }}
              >
                {/* Menu Item */}
                <MenuItem disabled selected value="Select List">
                  Select List
                </MenuItem>
                {taskList &&
                  taskList.listArr.length !== 0 &&
                  taskList.listArr?.map((option, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={option.name}
                        sx={{
                          height: "48px", // set the height to 48px
                          display: "flex",
                          alignItems: "center", // vertically center the content
                          width: "fitContent",
                          backgroundColor: mode ? "" : "white",
                        }}
                      >
                        {option.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>

            {/* Input for Date */}
            <input
              type="date"
              name="date"
              id=""
              value={createTask.date}
              onChange={handleCreateTaskChange}
              style={{
                color: "black",
                backgroundColor: mode ? "#D9D9D9" : "white",
              }}
            />

            <div className="doneBox">
              <Checkbox
                id="done"
                checked={createTask.done}
                name="done"
                onChange={(e) => {
                  setCreateTask({
                    ...createTask,
                    done: e.target.checked,
                  });
                }}
                sx={{
                  color: pink[800],
                  "&.Mui-checked": {
                    color: pink[600],
                  },
                }}
              />
              <label
                htmlFor="done"
                style={{
                  color: mode ? "black" : "white",
                  cursor: "pointer",
                }}
              >
                Done
              </label>
            </div>

            {/* Add Task Button */}
            <Button
              sx={{
                width: "90%",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                color: mode ? "rgb(65, 65, 65)" : "white",
                mt: 2,
                mb: 1,
                pt: 1.2,
                pb: 1.2,
                fontWeight: "600",
              }}
              size="medium"
              variant="outlined"
              color="warning"
              onClick={addSubTask}
            >
              {/* Add Icon */}
              <AddCircleIcon
                sx={{
                  mr: 1.2,
                }}
              />{" "}
              Add Subtask
            </Button>

            {createTask.subtask.length !== 0 &&
              createTask.subtask.map((s, i) => {
                return (
                  <div key={i} className="subBox">
                    <textarea
                      name="subtask"
                      id=""
                      placeholder="Subtask..."
                      value={s}
                      onChange={(e) => {
                        handleSubTaskChange(e, i);
                      }}
                      style={{
                        color: "black",
                        backgroundColor: mode ? "#D9D9D9" : "white",
                        fontWeight: "400",
                        letterSpacing: "0.5px",
                      }}
                    />
                    <DeleteIcon
                      onClick={() => {
                        deleteSubTask(i);
                      }}
                      sx={{
                        color: "red",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                );
              })}

            <div
              className="fixed"
              style={{
                backgroundColor: mode ? "rgb(238, 238, 238)" : "rgb(0, 11, 19)",
              }}
            >
              {editTask ? (
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    m: 1,
                  }}
                  onClick={handleDeleteTask}
                >
                  Delete Task
                </Button>
              ) : (
                <></>
              )}
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  m: 1,
                }}
                onClick={() => {
                  editTask ? handleEditTask() : handleSubmitTask();
                }}
              >
                Save
              </Button>
            </div>

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
        <></>
      )}
    </>
  );
};

export default AddTask;
