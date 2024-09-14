// React
import React from "react";
// Task CSS
import "./Task.css";

// Logo
import logo from "../../Logo/logo.webp";

/* ------------- MUI Icons ------------- */
// Add Icon
import AddIcon from "@mui/icons-material/Add";
// Right Arrow Icon
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// Calender Icon
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// Sad Icon
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
// Menu Icon
import MenuIcon from "@mui/icons-material/Menu";

/* ------------- MUI Components ------------- */
// Button
import Button from "@mui/material/Button";
// Pink Color
import { pink } from "@mui/material/colors";
// Checkbox
import Checkbox from "@mui/material/Checkbox";
// Icon Button
import IconButton from "@mui/material/IconButton";
// Tooltip
import Tooltip from "@mui/material/Tooltip";

/* ------------- MUI Structure ------------- */
// Skeleton
import Skeleton from "@mui/material/Skeleton";

const Task = (props) => {
  // Take All Props
  const {
    // Mode UseState Props
    mode,
    // Task Filter UseState Props
    taskFilter,
    // Task List UseState Props
    taskList,
    // Create Task UseState
    setCreateTask,
    // Edit Task UseState
    setEditTask,
    // Details Open UseState
    setDetailsOpen,
    // Width UseState
    w,
  } = props;

  // Label for Checkbox
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  // Reverse Date Func
  const reverseDate = (d) => {
    const splitDate = d.split("-");
    const reverseDate = splitDate.reverse();
    const joinDate = reverseDate.join("-");
    return joinDate;
  };

  // List Color Func
  const listColor = (lName) => {
    // Return List Color by using List Name
    if (taskList && taskList.listArr.length !== 0) {
      const foundList = taskList.listArr.find((tl) => tl.name === lName);
      if (foundList) {
        return foundList.color;
      }
    }
  };

  return (
    <>
      {/* Task Main Box */}
      <div className="taskMainBox">
        {/* Task Name Heading */}
        <h2
          style={{
            alignSelf: "flex-start",
            margin: "10px",
            marginLeft: "15px",
            color: mode ? "rgb(65, 65, 65)" : "white",
          }}
        >
          {/* Menu Icon */}
          <MenuIcon
            sx={{
              color: mode ? "black" : "white",
              fontSize: "1.5rem",
              mt: 0,
              ml: 0,
              mb: 1,
              display: w <= 1000 ? "block" : "none",
            }}
            onClick={() => {
              setDetailsOpen(true);
            }}
          />

          {taskFilter.name}
          {/* Task Count Button */}
          <Button
            size="medium"
            variant="outlined"
            color="secondary"
            sx={{
              fontSize: "1.2rem",
              ml: 1,
              p: 0,
              color: mode ? "rgb(65, 65, 65)" : "white",
            }}
          >
            {taskFilter.count}
          </Button>
        </h2>

        {/* Add Task Button */}
        <Button
          sx={{
            width: "95%",
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
          onClick={() => {
            setCreateTask({
              title: "",
              description: "",
              list: "",
              date: "",
              subtask: [],
              done: false,
            });
            setEditTask(false);
          }}
        >
          {/* Add Icon */}
          <AddIcon
            sx={{
              mr: 1.2,
            }}
          />{" "}
          Add New Task
        </Button>

        {/* All Task Box */}
        <div className="allTaskBox">
          {/* If Filter Task Present */}
          {taskFilter &&
          taskFilter.filteredTasks &&
          taskFilter.filteredTasks.length !== 0 ? (
            <>
              {taskFilter.filteredTasks.map((tf) => {
                return (
                  // Per Task Box
                  <div
                    className="perTaskBox"
                    style={{
                      color: mode ? "rgb(65, 65, 65)" : "white",
                      backgroundColor: mode ? "whitesmoke" : "rgb(0, 11, 19)",
                    }}
                    key={tf._id}
                  >
                    {/* Up Box */}
                    <div className="up">
                      {/* Check Box */}
                      <Checkbox
                        {...label}
                        checked={tf.done}
                        sx={{
                          color: pink[800],
                          "&.Mui-checked": {
                            color: pink[600],
                          },
                          ml: 1,
                        }}
                      />
                      {/* Heading of Task Title*/}
                      <span className="title">{tf.title}</span>
                      {/* Tooltip */}
                      <Tooltip
                        title="Open task"
                        sx={{
                          mr: 1,
                          marginLeft: "auto",
                          textAlign: "end",
                          cursor: "pointer",
                          color: mode ? "rgb(65, 65, 65)" : "white",
                        }}
                        onClick={() => {
                          setCreateTask(tf);
                          setEditTask(true);
                        }}
                      >
                        {/* Icon Button */}
                        <IconButton>
                          {/* Right Arrow Icon */}
                          <KeyboardArrowRightIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                    {/* Down Box */}
                    <div className="down">
                      {/* Date Box */}
                      <div
                        className="date"
                        style={{
                          boxShadow: mode
                            ? "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                            : "rgba(255, 251, 251, 0.301) 0px 1px 3px 0px, rgba(252, 254, 255, 0.39) 0px 0px 0px 1px",
                        }}
                      >
                        {/* Calender Icon */}
                        <CalendarMonthIcon
                          sx={{
                            mr: 1,
                            cursor: "pointer",
                          }}
                        />
                        {/* Reverse the Date */}
                        {reverseDate(tf.date)}
                      </div>
                      {/* SubTask Box */}
                      <div
                        className="subTask"
                        style={{
                          boxShadow: mode
                            ? "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                            : "rgba(255, 251, 251, 0.301) 0px 1px 3px 0px, rgba(252, 254, 255, 0.39) 0px 0px 0px 1px",
                        }}
                      >
                        {/* Total Subtask Box */}
                        <span
                          style={{
                            backgroundColor: mode
                              ? "rgb(255, 208, 0)"
                              : "green",
                          }}
                        >
                          {tf.subtask.length}
                        </span>
                        {/* Heading */}
                        <span>Subtask</span>
                      </div>
                      {/* List Name Box */}
                      <div
                        className="listN"
                        style={{
                          boxShadow: mode
                            ? "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                            : "rgba(255, 251, 251, 0.301) 0px 1px 3px 0px, rgba(252, 254, 255, 0.39) 0px 0px 0px 1px",
                        }}
                      >
                        {/* List Color Box */}
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "5px",
                            backgroundColor: `${listColor(tf.list)}`,
                            marginRight: "15px",
                          }}
                        ></div>
                        {/* List name Box */}
                        <span>{tf.list}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {/* f No Task Present */}
              {taskFilter.filteredTasks &&
              taskFilter.filteredTasks.length === 0 ? (
                <>
                  {/* Per Task Box */}
                  <div
                    className="perTaskBox"
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      color: mode ? "darkred" : "yellow",
                      boxShadow: "none",
                    }}
                  >
                    {/* Sad Icon */}
                    <SentimentDissatisfiedIcon
                      sx={{
                        mt: 1.5,
                        mb: 1.5,
                        fontSize: "2rem",
                      }}
                    />
                    {/* Heading */}
                    <p>No Task Found `~`</p>

                    <img
                      src={logo}
                      alt=""
                      style={{
                        width: "200px",
                        marginBottom: "10px",
                      }}
                    />
                    <h5>Create Your Task Now !!</h5>
                  </div>
                </>
              ) : (
                <>
                  {/* Show Skeleton Initially */}
                  {[0, 1].map((s, i) => {
                    return (
                      // Skeleton Box
                      <div
                        className="perTaskBox"
                        key={i}
                        style={{
                          boxShadow: "none",
                        }}
                      >
                        {/* Skeleton for List */}
                        <Skeleton
                          variant="rectangular"
                          height={80}
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
      </div>
    </>
  );
};

export default Task;
