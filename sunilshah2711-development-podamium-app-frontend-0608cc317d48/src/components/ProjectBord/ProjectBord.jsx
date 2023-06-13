import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Offcanvas, Form, Tabs, Tab } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import styles from "./ProjectBord.module.scss";

// Project board frontend view

const ProjectBord = (filters) => {
  const { workspaceid } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const project_id = query.get("project_id");
  const [showtask, setShowtask] = useState(false);
  const [showupdatetask, setShowupdatetask] = useState(false);

  const handleCloseTask = () => setShowtask(false);
  const handleShowTask = () => setShowtask(true);
  const handleCloseUpdateTask = () => setShowupdatetask(false);
  const handleShowUpdateTask = () => setShowupdatetask(true);

  // When drag start

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      let destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      const updatTask = (taskstatus) => {
        let auth_code = localStorage.getItem("auth_code");
        axios
          .post(
            `https://api.podamium.com/v1/${workspaceid}/projects/${project_id}/tasks/update/${removed.uuid}`,
            {
              name: removed.name,
              description: removed.description,
              start_date: removed.start_date,
              end_date: removed.end_date,
              priority: removed.priority,
              parent_id: 0,
              type: removed.type,
              status: taskstatus,
            },
            {
              headers: {
                "content-type": "application/json",
                "x-access-token": auth_code,
              },
            }
          )
          .then((res) => {})
          .catch((error) => {
            console.log(error);
          });
      };

      if (destColumn.name === "To do") {
        const taskstatus = 0;
        updatTask(taskstatus);
      } else if (destColumn.name === "Doing") {
        const taskstatus = 1;
        updatTask(taskstatus);
      } else if (destColumn.name === "Done") {
        const taskstatus = 2;
        updatTask(taskstatus);
      } else if (destColumn.name === "Backlog") {
        const taskstatus = 3;
        updatTask(taskstatus);
      }

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const [columns, setColumns] = useState([]);
  const [todo, setTodo] = useState([]);
  const [doing, setDoing] = useState([]);
  const [done, setDone] = useState([]);
  const [backlog, setBacklog] = useState([]);

  // Filter logic
  const [unread, setUnread] = useState([]);
  const [taskcomment, setTaskcomment] = useState([]);
  const [nocommentsaven, setNocommentsaven] = useState([]);
  const [taskcommentthirty, setTaskcommentthirty] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  // const [regularSelect, setRegularSelect] = useState([]);
  const [regularInupt, setRegularInput] = useState([]);

  // console.log(regularInupt);

  const somefilters = Object.keys(filters).map(
    (key) => {
      if (filters[key].checkedItems === undefined) {
        return false;
      }
      return filters[key];
    },
    [filters]
  );

  const maindata = somefilters[0];

  useEffect(() => {
    if (maindata.checkedItems !== undefined) {
      setCheckedItems(maindata.checkedItems);
    }

    // if (maindata.regularSelect !== undefined) {
    //   setRegularSelect(maindata.regularSelect);
    // }

    // if (maindata.regularInput !== undefined) {
    //   setRegularInput(maindata.regularInput);
    // }

    if (checkedItems["Unread"] === true) {
      setUnread("unread=0");
    } else {
      setUnread("");
    }

    if (checkedItems["No Comment - All Time"] === true) {
      setTaskcomment("task_comment=");
    } else {
      setTaskcomment("");
    }

    if (checkedItems["No Comment - Last 7 Days"] === true) {
      setNocommentsaven("nocomment=7");
    } else {
      setNocommentsaven("");
    }

    if (checkedItems["No Comment - Last 30 Days"] === true) {
      setTaskcommentthirty("nocomment=30");
    } else {
      setTaskcommentthirty("");
    }

    if (checkedItems["Name"] === true) {
      setRegularInput(`name=${filters.filter.regularInput}`);
    } else {
      setRegularInput("");
    }
  }, [checkedItems, maindata, todo, doing, done, backlog, filters]);

  const url = `https://api.podamium.com/v1/${workspaceid}/task/get?uuid=${project_id}&${unread}&${taskcomment}&${nocommentsaven}&${taskcommentthirty}&${regularInupt}`;

  // console.log(url);

  const tasklist = async (url) => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        url,
        {
          data: "data",
        },
        {
          headers: {
            "content-type": "application/json",
            "x-access-token": auth_code,
          },
        }
      )
      .then((res) => {
        let data = res.data.data.payload;

        const todo = data.filter((item) => {
          return item.status === 0;
        });

        const doing = data.filter((item) => {
          return item.status === 1;
        });

        const done = data.filter((item) => {
          return item.status === 2;
        });

        const backlog = data.filter((item) => {
          return item.status === 3;
        });

        return [
          setTodo(todo),
          setDoing(doing),
          setDone(done),
          setBacklog(backlog),
        ];
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tasktype, setTasktype] = useState("");
  const [priority, setPriority] = useState("");
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [taskitem, setTaskItem] = useState("");
  const [comment, setComment] = useState("");
  const [listcomment, setListcomment] = useState("");
  // console.log(listcomment);

  const commentlist = async (workspaceid, project_id, taskitem) => {
    let auth_code = localStorage.getItem("auth_code");
    if (taskitem.uuid !== undefined) {
      axios
        .post(
          `https://api.podamium.com/v1/${workspaceid}/projects/${project_id}/tasks/${taskitem.uuid}/comments/lists`,
          {
            data: "data",
          },
          {
            headers: {
              "content-type": "application/json",
              "x-access-token": auth_code,
            },
          }
        )
        .then((res) => {
          let data = res.data.data.payload;
          return setListcomment(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const createcomment = async () => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        `https://api.podamium.com/v1/${workspaceid}/projects/${project_id}/tasks/${taskitem.uuid}/comments/create`,
        {
          comment: comment,
        },
        {
          headers: {
            "content-type": "application/json",
            "x-access-token": auth_code,
          },
        }
      )
      .then((res) => {
        commentlist(workspaceid, project_id, taskitem);
        toast.success(`${res.data.data.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(`${error.response.data.data.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  const createtask = async () => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        `https://api.podamium.com/v1/${workspaceid}/projects/${project_id}/tasks/create`,
        {
          name: name,
          description: description,
          type: tasktype,
          priority: priority,
          start_date: startdate,
          end_date: enddate,
          parent_id: 0,
        },
        {
          headers: {
            "content-type": "application/json",
            "x-access-token": auth_code,
          },
        }
      )
      .then((res) => {
        tasklist(url);
        toast.success(`${res.data.data.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(`${error.response.data.data.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  // Update project

  // console.log(taskitem.uuid);

  const updatetasklist = async (taskitem) => {
    const startDate = moment(`${taskitem.start_date}`)
      .utc()
      .format("YYYY-MM-DD");
    const endDate = moment(`${taskitem.end_date}`).utc().format("YYYY-MM-DD");
    setName(taskitem.name);
    setDescription(taskitem.description);
    setTasktype(taskitem.type);
    setPriority(taskitem.priority);
    setStartdate(startDate);
    setEnddate(endDate);
  };

  // const updatetask = async () => {
  //   let auth_code = localStorage.getItem("auth_code");
  //   axios
  //     .post(
  //       `https://api.podamium.com/v1/${workspaceid}/projects/${project_id}/tasks/update/${taskitem.uuid}`,
  //       {
  //         name: name,
  //         description: description,
  //         type: tasktype,
  //         priority: priority,
  //         start_date: startdate,
  //         end_date: enddate,
  //         parent_id: 0,
  //       },
  //       {
  //         headers: {
  //           "content-type": "application/json",
  //           "x-access-token": auth_code,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       tasklist(url);
  //       toast.success(`${res.data.data.message}`, {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       toast.error(`${error.response.data.data.message}`, {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //       });
  //     });
  // };

  useEffect(() => {
    setColumns({
      1: {
        name: "To do",
        items: todo,
      },
      2: {
        name: "Doing",
        items: doing,
      },
      3: {
        name: "Done",
        items: done,
      },
      4: {
        name: "Backlog",
        items: backlog,
      },
    });
  }, [todo, doing, done, backlog]);

  useEffect(() => {
    tasklist(url);
  }, [url]);

  useEffect(() => {
    updatetasklist(taskitem);
  }, [taskitem]);

  useEffect(() => {
    commentlist(workspaceid, project_id, taskitem);
  }, [workspaceid, project_id, taskitem]);

  return (
    <>
      <Button variant="primary" className="mb-3" onClick={handleShowTask}>
        Add New Task
      </Button>
      <Offcanvas placement="end" show={showtask} onHide={handleCloseTask}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Description"
                rows={3}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Task Type</Form.Label>
              <Form.Select
                defaultValue={"DEFAULT"}
                onChange={(e) => {
                  setTasktype(e.target.value);
                }}
              >
                <option value="DEFAULT" disabled>
                  Choose a salutation ...
                </option>
                <option value="New Feature">New Feature</option>
                <option value="Feature Improvement">Feature Improvement</option>
                <option value="Bug fix">Bug fix</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                defaultValue={"DEFAULT"}
                onChange={(e) => {
                  setPriority(e.target.value);
                }}
              >
                <option value="DEFAULT" disabled>
                  Choose a salutation ...
                </option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => {
                  setStartdate(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => {
                  setEnddate(e.target.value);
                }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseTask}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                createtask();
                setShowtask(false);
              }}
            >
              Add Task
            </Button>
          </Modal.Footer>
        </Form>
      </Offcanvas>

      <Offcanvas
        placement="end"
        show={showupdatetask}
        onHide={handleCloseUpdateTask}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Tabs defaultActiveKey="details" className="mb-2">
              <Tab eventKey="details" title="Details">
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={name ?? ""}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Description"
                    rows={3}
                    value={description ?? ""}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Task Type</Form.Label>
                  <Form.Select
                    value={tasktype ?? ""}
                    onChange={(e) => {
                      setTasktype(e.target.value);
                    }}
                  >
                    <option value="New Feature">New Feature</option>
                    <option value="Feature Improvement">
                      Feature Improvement
                    </option>
                    <option value="Bug fix">Bug fix</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={priority ?? ""}
                    onChange={(e) => {
                      setPriority(e.target.value);
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startdate ?? ""}
                    onChange={(e) => {
                      setStartdate(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={enddate ?? ""}
                    onChange={(e) => {
                      setEnddate(e.target.value);
                    }}
                  />
                </Form.Group>
              </Tab>
              <Tab eventKey="comments" title="Comments">
                <Form.Group className="mb-3">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Comment"
                    rows={3}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />
                </Form.Group>
                <Button
                  onClick={() => {
                    createcomment();
                  }}
                >
                  Add Comment
                </Button>
                <div>
                  <h4 className="my-2">Comments</h4>
                  {Array.from(listcomment).map((element) => {
                    return (
                      <div key={element.uuid}>
                        <h5>{element.comment}</h5>
                        {Object.keys(element.created_by).map((key) => {
                          return (
                            <div key={key}>
                              <p>Created By: {element.created_by[key]}</p>
                              <br />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </Tab>
            </Tabs>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseUpdateTask}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                createtask();
                setShowupdatetask(false);
              }}
            >
              Update Task
            </Button>
          </Modal.Footer> */}
        </Form>
      </Offcanvas>

      <div className={styles.Board}>
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column]) => {
            return (
              <div key={columnId} className={styles.columnContainer}>
                <p>{column.name}</p>
                <div style={{ padding: 8 }} className={styles.columns}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          className={styles.innerColumn}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "white",
                            width: 200,
                            height: 400,
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.uuid}
                                draggableId={item.uuid}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  const startDate = moment(`${item.start_date}`)
                                    .utc()
                                    .format("MMM DD");
                                  const endDate = moment(`${item.end_date}`)
                                    .utc()
                                    .format("MMM DD");
                                  return (
                                    <div
                                      className={styles.columnItem}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        padding: 16,
                                        margin: "0 0 8px 0",
                                        minHeight: "25px",
                                        fontSize: "13px",
                                        backgroundColor: snapshot.isDragging
                                          ? "rgba(0, 82, 204, 0.1)"
                                          : "rgba(0, 82, 204, 0.1)",
                                        color: "black",
                                        ...provided.draggableProps.style,
                                      }}
                                      onClick={() => {
                                        handleShowUpdateTask();
                                        setTaskItem(item);
                                      }}
                                    >
                                      <div className={styles.upper}>
                                        {/* <CheckCircleOutline color="primary" /> */}
                                        <Form>
                                          <Form.Check
                                            // onChange={unread}
                                            type="switch"
                                          />
                                        </Form>
                                        {item.name}
                                      </div>
                                      <br />
                                      <div className={styles.lower}>
                                        {/* <div className={styles.box}>SS</div> */}
                                        <div className={styles.date}>
                                          {startDate} - {endDate}
                                        </div>
                                        {/* <CheckBoxOutlined color="primary" /> */}
                                        <span className={styles.numberOfTask}>
                                          {item.type}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProjectBord;
