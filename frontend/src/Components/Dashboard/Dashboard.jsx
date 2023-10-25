// React & UseState & UseEffect
import React, { useState, useEffect } from "react";
// Dashboard CSS
import "./Dashboard.css";

/* ------------- Fetch ------------- */
// Axios
import axios from "axios";

/* ------------- Components ------------- */
// Home Page
import Home from "../Home/Home";
// Details Page
import Details from "../Details/Details";
// Task Page
import Task from "../Task/Task";

/* ------------- Backend Url ------------- */
// Base URL
import baseUrl from "../../Helper/BaseUrl";

/* ------------- React Router Dom ------------- */
// UseNavigate
import { useNavigate } from "react-router-dom";

/* ------------- Storage ------------- */
// Cookies
import Cookies from "js-cookie";

/* ------------- Alerts ------------- */
// Sweetalert
import Swal from "sweetalert2";
import AddTask from "../AddTask/AddTask";

const Dashboard = () => {
  // Take the token and userid if it is not peresent redirect to SignIn page
  if (!(Cookies.get("token") && Cookies.get("userid"))) {
    Cookies.remove("token");
    Cookies.remove("userid");
    window.location.href = "/";
  }

  // UseNavigate
  const navigate = useNavigate();

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

  const handleCountFormat = (c) => {
    if (c >= 100) {
      return "99+";
    }
    return c;
  };

  // UserEffect for get the user task details
  useEffect(() => {
    const fetchUserTask = async () => {
      try {
        // Take the Token and Userid
        const token = Cookies.get("token");
        const userid = Cookies.get("userid");

        // If token and userid present
        if (token && userid) {
          // Axios Get Request from Backend
          axios
            .get(`${baseUrl}/api/task/get-all-task/${userid}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              const today = new Date();
              const todayDate = today.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

              if (res.data && res.data.taskArr.length !== 0) {
                const { taskArr } = res.data;

                let upcomingCount = 0;
                let previousCount = 0;
                let todayCount = 0;

                taskArr.forEach((task) => {
                  if (task.date > todayDate) {
                    upcomingCount++;
                  } else if (task.date < todayDate) {
                    previousCount++;
                  } else {
                    todayCount++;
                  }
                });

                setTaskCount({
                  upcomingCount: handleCountFormat(upcomingCount),
                  previousCount: handleCountFormat(previousCount),
                  todayCount: handleCountFormat(todayCount),
                });

                const filteredTasks = taskArr.filter(
                  (task) => task.date === todayDate
                );
                setTaskFilter({
                  name: "Today",
                  count: todayCount,
                  filteredTasks,
                });
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

  // console.log(taskFilter);
  // Active Filter Buttons UseState
  const [activeFilter, setActiveFilter] = useState(2);

  // Mode UseState for Light and Dark Mode
  const [mode, setMode] = useState(true);

  // TaskList UseState
  const [taskList, setTaskList] = useState("");

  const [createTask, setCreateTask] = useState({
    title: "",
    description: "",
    list: "",
    date: "",
    subtask: [],
    done: false,
  });

  const [editTask, setEditTask] = useState(false);

  return (
    <>
      {/* If Token and UserId present then open dashboard */}
      {Cookies.get("token") && Cookies.get("userid") ? (
        <>
          {/* Dashboard Main Box */}
          <div
            className="dahsboardMainBox"
            style={{
              backgroundColor: mode ? "white" : "rgb(29, 29, 29)",
            }}
          >
            <Details
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              task={task}
              setTask={setTask}
              taskFilter={taskFilter}
              setTaskFilter={setTaskFilter}
              mode={mode}
              setMode={setMode}
              taskCount={taskCount}
              taskList={taskList}
              setTaskList={setTaskList}
            />

            <Task
              mode={mode}
              taskFilter={taskFilter}
              taskList={taskList}
              setCreateTask={setCreateTask}
              setEditTask={setEditTask}
            />

            <AddTask
              mode={mode}
              createTask={createTask}
              setCreateTask={setCreateTask}
              editTask={editTask}
              setEditTask={setEditTask}
              taskList={taskList}
              setTaskList={setTaskList}
              task={task}
              setTask={setTask}
              setTaskFilter={setTaskFilter}
              setTaskCount={setTaskCount}
              setActiveFilter={setActiveFilter}
              activeFilter={activeFilter}
            />
          </div>
        </>
      ) : (
        <>
          {/* If Token and UserId not present then redirect SignIn */}
          <Home />
        </>
      )}
    </>
  );
};

export default Dashboard;
