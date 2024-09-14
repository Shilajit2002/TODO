// React & UseState
import React, { useState } from "react";
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
// Add Icon
import AddCircleIcon from "@mui/icons-material/AddCircle";
// Delete Icon
import DeleteIcon from "@mui/icons-material/Delete";

/* ------------- MUI Components ------------- */
// Button
import Button from "@mui/material/Button";
// TextFiled
import TextField from "@mui/material/TextField";
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

/* ------------- Alerts ------------- */
// Snack Bar
import Snackbar from "@mui/material/Snackbar";
// Alert
import MuiAlert from "@mui/material/Alert";

const AddTask = (props) => {
  // Take All Props
  const {
    // Mode UseState Props
    mode,
    // Create Task UseState Props
    createTask,
    setCreateTask,
    // Edit Task UseState Props
    editTask,
    setEditTask,
    // Task List UseState Props
    taskList,
    setTaskList,
    // Task UseState Props
    setTask,
    // Task Filter UseState Props
    setTaskFilter,
    // Task Count UseState Props
    setTaskCount,
    // Active Filter UseState Props
    activeFilter,
    // Loader UseState
    setOpenLoader,
  } = props;

  /* ------------- All UseState ------------- */
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

  // Handle Create Task Func
  const handleCreateTaskChange = (e) => {
    const { name, value } = e.target;

    setCreateTask({
      ...createTask,
      [name]: value,
    });
  };

  // SubTask Change Func
  const handleSubTaskChange = (e, i) => {
    const updateSubtask = { ...createTask };
    updateSubtask.subtask[i] = e.target.value;
    setCreateTask(updateSubtask);
  };

  // Add SubTask Func
  const addSubTask = () => {
    const updateSubtask = { ...createTask };
    updateSubtask.subtask.push("");
    setCreateTask(updateSubtask);
  };

  // Delete SubTask Func
  const deleteSubTask = (i) => {
    const updateSubtask = { ...createTask };
    updateSubtask.subtask.splice(i, 1);
    setCreateTask(updateSubtask);
  };

  // Count Format Func
  const handleCountFormat = (c) => {
    if (c >= 100) {
      return "99+";
    }
    return c;
  };

  // All List Func
  const allList = () => {
    // Take the Token and Userid
    const token = Cookies.get("token");
    const userid = Cookies.get("userid");

    // If token and userid present
    if (token && userid) {
      // Axios Get Request from Backend
      axios
        .get(`${baseUrl}/lists/get-all-list/${userid}`, {
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

  // Count Func
  const countFunc = (res) => {
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // If the response present
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
      if (
        activeFilter !== 1 &&
        activeFilter !== 2 &&
        activeFilter !== 3 &&
        activeFilter !== 4
      ) {
        const token = Cookies.get("token");
        const userid = Cookies.get("userid");

        //  Axios get request from backend
        axios
          .get(`${baseUrl}/lists/get-per-list/${userid}/${activeFilter}`, {
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
          })
          .catch((err) => {
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
    // When no task is present
    else {
      window.location.reload();
    }
  };

  // Task Add Func
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
        setOpenLoader(true);

        // Send to the Backend
        axios
          .post(`${baseUrl}/tasks/create-task/${userid}`, createTask, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            // Call AllList Func
            allList();
            // Count Func
            countFunc(res);

            setOpenLoader(false);

            // Success Result
            setSnack({
              open: true,
              message: "** Task Added **",
              severity: "success",
            });
          })
          .catch((err) => {
            setOpenLoader(false);

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

  // Task Edit Func
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
        setOpenLoader(true);

        // Send to the Backend
        axios
          .put(`${baseUrl}/tasks/edit-task/${userid}`, createTask, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            // Call AllList Func
            allList();
            // Count Func
            countFunc(res);

            setOpenLoader(false);

            // Success Result
            setSnack({
              open: true,
              message: "** Task Updated **",
              severity: "success",
            });
          })
          .catch((err) => {
            setOpenLoader(false);

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

  // Delete Func
  const handleDeleteTask = () => {
    // Take the Token and Userid
    const token = Cookies.get("token");
    const userid = Cookies.get("userid");

    if (token && userid) {
      // Check if the data is fill or not
      if (createTask._id) {
        setOpenLoader(true);

        // Send to the Backend
        axios
          .delete(`${baseUrl}/tasks/delete-task/${userid}/${createTask._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            // Call AllList Func
            allList();
            // Count Func
            countFunc(res);

            setOpenLoader(false);

            // Success Result
            setSnack({
              open: true,
              message: "** Task Deleted **",
              severity: "success",
            });
          })
          .catch((err) => {
            setOpenLoader(false);

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
      {/* Main Add Task Box */}
      <div
        className="addTaskBox"
        style={{
          backgroundColor: mode ? "rgb(238, 238, 238)" : "rgb(0, 11, 19)",
        }}
      >
        {/* Heading */}
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

        {/* Title Field */}
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

        {/* Description Field */}
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

        {/* Select Form List*/}
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
            {/* Menu Item */}
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

        {/* Done Box */}
        <div className="doneBox">
          {/* CheckBox */}
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
          {/* Label */}
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

        {/* Map All the Subtask */}
        {createTask.subtask.length !== 0 &&
          createTask.subtask.map((s, i) => {
            return (
              // Per SubBox
              <div key={i} className="subBox">
                {/* TextArea */}
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
                {/* Delete Icon */}
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

        {/* Fixed Box */}
        <div
          className="fixed"
          style={{
            backgroundColor: mode ? "rgb(238, 238, 238)" : "rgb(0, 11, 19)",
          }}
        >
          {/* If is it Edit then show Delete Button Other wise Not */}
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

          {/* Save Button */}
          <Button
            variant="contained"
            color="success"
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
  );
};

export default AddTask;
