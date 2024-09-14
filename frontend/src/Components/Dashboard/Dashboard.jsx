// React & UseState & UseEffect
import React, { useState, useEffect } from "react";
// Dashboard CSS
import "./Dashboard.css";

/* ------------- Fetch ------------- */
// Axios
import axios from "axios";

/* ------------- Components ------------- */
// Details Page
import Details from "../Details/Details";
// Task Page
import Task from "../Task/Task";
// Add Task Page
import AddTask from "../AddTask/AddTask";

/* ------------- Backend Url ------------- */
// Base URL
import baseUrl from "../../Helper/BaseUrl";

/* ------------- Storage ------------- */
// Cookies
import Cookies from "js-cookie";

/* ------------- MUI Components ------------- */
// Backdrop
import Backdrop from "@mui/material/Backdrop";

const Dashboard = () => {
  /* ------------- All UseState ------------- */
  // Task UseState
  const [task, setTask] = useState();

  // TaskFilter UseState
  const [taskFilter, setTaskFilter] = useState({
    name: "Today",
    count: 0,
  });

  // TaskCount UseState
  const [taskCount, setTaskCount] = useState({
    upcomingCount: 0,
    todayCount: 0,
    previousCount: 0,
  });

  // Active Filter Buttons UseState
  const [activeFilter, setActiveFilter] = useState(2);

  // Mode UseState for Light and Dark Mode
  const [mode, setMode] = useState(true);

  // TaskList UseState
  const [taskList, setTaskList] = useState("");

  // Create Task UseState
  const [createTask, setCreateTask] = useState({
    title: "",
    description: "",
    list: "",
    date: "",
    subtask: [],
    done: false,
  });

  // Edit Task UseState
  const [editTask, setEditTask] = useState(false);

  // Details Open/Close UseState
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Width UseState
  const [w, setW] = useState(window.innerWidth);

  //  Open Loader UseState
  const [openLoader, setOpenLoader] = useState(false);

  // Count Format Func
  const handleCountFormat = (c) => {
    if (c >= 100) {
      return "99+";
    }
    return c;
  };

  // UserEffect for get the user task details
  useEffect(() => {
    // Async Func
    const fetchUserTask = async () => {
      try {
        // Take the Token and Userid
        const token = Cookies.get("token");
        const userid = Cookies.get("userid");

        // If token and userid present
        if (token && userid) {
          // Axios Get Request from Backend
          axios
            .get(`${baseUrl}/tasks/get-all-task/${userid}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              const today = new Date();
              const todayDate = today.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

              // When data is present
              if (res.data && res.data.taskArr.length !== 0) {
                const { taskArr } = res.data;

                let upcomingCount = 0;
                let previousCount = 0;
                let todayCount = 0;

                // Count the Task
                taskArr.forEach((task) => {
                  if (task.date > todayDate) {
                    upcomingCount++;
                  } else if (task.date < todayDate) {
                    previousCount++;
                  } else {
                    todayCount++;
                  }
                });

                // Set the State
                setTaskCount({
                  upcomingCount: handleCountFormat(upcomingCount),
                  previousCount: handleCountFormat(previousCount),
                  todayCount: handleCountFormat(todayCount),
                });

                // Filtering the Task
                const filteredTasks = taskArr.filter(
                  (task) => task.date === todayDate
                );

                // Set the Filter State with Today Default
                setTaskFilter({
                  name: "Today",
                  count: todayCount,
                  filteredTasks,
                });
                // Set All task Data State
                setTask(res.data);
              } else {
                setTaskFilter({
                  name: "Today",
                  count: 0,
                  filteredTasks: [],
                });
              }
            })
            .catch((err) => {
              window.location.reload();
            });
        }
      } catch (error) {
        window.location.reload();
      }
    };
    fetchUserTask();
  }, []);

  // UseEffect to update the width state when the window is resized
  useEffect(() => {
    // Resize Func
    const handleResize = () => {
      setW(window.innerWidth);
    };

    // Add event listener for window resize event
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Dashboard Main Box */}
      <div
        className="dahsboardMainBox"
        style={{
          backgroundColor: mode ? "white" : "rgb(29, 29, 29)",
        }}
      >
        {/* Details Component */}
        <Details
          // Active Filter UseState Props
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          // Task UseState Props
          task={task}
          setTask={setTask}
          // Task Filter UseState Props
          taskFilter={taskFilter}
          setTaskFilter={setTaskFilter}
          // Mode UseState Props
          mode={mode}
          setMode={setMode}
          // Task Count UseState Props
          taskCount={taskCount}
          // Task List UseState Props
          taskList={taskList}
          setTaskList={setTaskList}
          // Details Open UseState
          detailsOpen={detailsOpen}
          setDetailsOpen={setDetailsOpen}
          // Width UseState
          w={w}
          // Loader UseState
          openLoader={openLoader}
          setOpenLoader={setOpenLoader}
        />

        {/* Task Component */}
        <Task
          // Mode UseState Props
          mode={mode}
          // Task Filter UseState Props
          taskFilter={taskFilter}
          // Task List UseState Props
          taskList={taskList}
          // Create Task UseState
          setCreateTask={setCreateTask}
          // Edit Task UseState
          setEditTask={setEditTask}
          // Details Open UseState
          setDetailsOpen={setDetailsOpen}
          // Width UseState
          w={w}
        />

        {/* Add Task Component */}
        <AddTask
          // Mode UseState Props
          mode={mode}
          // Create Task UseState Props
          createTask={createTask}
          setCreateTask={setCreateTask}
          // Edit Task UseState Props
          editTask={editTask}
          setEditTask={setEditTask}
          // Task List UseState Props
          taskList={taskList}
          setTaskList={setTaskList}
          // Task UseState Props
          setTask={setTask}
          // Task Filter UseState Props
          setTaskFilter={setTaskFilter}
          // Task Count UseState Props
          setTaskCount={setTaskCount}
          // Active Filter UseState Props
          activeFilter={activeFilter}
          // Loader UseState
          openLoader={openLoader}
          setOpenLoader={setOpenLoader}
        />

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

export default Dashboard;
