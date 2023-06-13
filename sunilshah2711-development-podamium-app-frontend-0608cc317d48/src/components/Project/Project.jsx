import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import DatatableHalf from "../../components/DatatableHalf/DatatableHalf";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";

// import styles from "./Project.module.scss";
import "./Project.scss";

const Project = () => {
  const { workspaceid } = useParams();
  const [project, setProjectList] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);

  const [Name, setName] = useState("");
  const [description, setDescription] = useState("");
  // const [assignee, setAssignee] = useState("");
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");

  const [updateContactId, setupdateContactId] = useState("");

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "uuid",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Assignee",
        accessor: "assignee",
        Cell: (props) => {
          const row = props.row.original.assignee;
          return (
            <>
              {row.map((object, i) => (
                <span key={i}>{object.name}</span>
              ))}
            </>
          );
        },
      },
      {
        Header: "Start Date",
        accessor: "start_date",
        Cell: (props) => {
          const row = props.row.original;
          const startDate = moment(`${row.start_date}`)
            .utc()
            .format("DD/MM/YYYY");
          return (
            <>
              <span>{startDate}</span>
            </>
          );
        },
      },
      {
        Header: "End Date",
        accessor: "end_date",
        Cell: (props) => {
          const row = props.row.original;
          const endDate = moment(`${row.end_date}`).utc().format("DD/MM/YYYY");
          return (
            <>
              <span>{endDate}</span>
            </>
          );
        },
      },
      {
        Header: "Created at",
        accessor: "created_at",
        Cell: (props) => {
          const row = props.row.original;
          const createdDate = moment(`${row.created_at}`)
            .utc()
            .format("DD/MM/YYYY");
          return (
            <>
              <span>{createdDate}</span>
            </>
          );
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          // console.log(props.row.original.id);
          let navigate = useNavigate();
          const row = props.row.original;
          const rowind = props.row.original.uuid;

          const viewproject = () => {
            navigate(`/${workspaceid}/task/get?project_id=${rowind}`);
          };

          const deleteproject = async (rowind) => {
            let auth_code = localStorage.getItem("auth_code");
            axios
              .post(
                `https://api.podamium.com/v1/${workspaceid}/projects/delete/${rowind}`,
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
                projectlist(workspaceid);
                toast.error(`${res.data.data.message}`, {
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
              });
          };

          return (
            <div className="d-flex">
              <Button
                onClick={viewproject}
                className="ms-2"
                variant="secondary"
              >
                View
              </Button>
              <Button
                onClick={() => {
                  setLgShow(true);
                  updateprojectlist(row);
                }}
                className="ms-2"
                variant="primary"
              >
                Update
              </Button>
              <Button
                onClick={() => {
                  deleteproject(rowind);
                }}
                className="ms-2"
                variant="danger"
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [workspaceid]
  );

  // Project list

  const projectlist = async (workspaceid) => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        `https://api.podamium.com/v1/${workspaceid}/projects/get`,
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
        return setProjectList(res.data.data.payload);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Project create

  const createproject = async () => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        `https://api.podamium.com/v1/${workspaceid}/projects/create`,
        {
          name: Name,
          description: description,
          start_date: startdate,
          end_date: enddate,
          project_category_id: 2,
        },
        {
          headers: {
            "content-type": "application/json",
            "x-access-token": auth_code,
          },
        }
      )
      .then((res) => {
        projectlist(workspaceid);
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

  const updateprojectlist = async (row) => {
    const startDate = moment(`${row.start_date}`).utc().format("YYYY-MM-DD");
    const endDate = moment(`${row.end_date}`).utc().format("YYYY-MM-DD");

    setName(row.name);
    setDescription(row.description);
    // setAssignee(row.assignee);
    setStartdate(startDate);
    setEnddate(endDate);
    setupdateContactId(row.uuid);
  };

  const updateproject = async (row) => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        `https://api.podamium.com/v1/${workspaceid}/projects/update/${row}`,
        {
          name: Name,
          description: description,
          // assignee: assignee,
          start_date: startdate,
          end_date: enddate,
          project_category_id: 2,
        },
        {
          headers: {
            "content-type": "application/json",
            "x-access-token": auth_code,
          },
        }
      )
      .then((res) => {
        projectlist(workspaceid);
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

  useEffect(() => {
    projectlist(workspaceid);
  }, [workspaceid]);

  // Project frontend design

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button onClick={() => setSmShow(true)}>Add New Project</Button>
      </div>
      <DatatableHalf columns={columns} data={project} />
      <Modal
        size="md"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        className="sidebar"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Add New Project
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter Description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </Form.Group>
            {/* <Form.Group className="mb-3">
              <Form.Label>Assignee</Form.Label>
              <Form.Control
                type="text"
                placeholder="Assignee"
                id="assignee"
                onChange={(e) => {
                  setAssignee(e.target.value);
                }}
              />
            </Form.Group> */}
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
            <Button
              variant="primary"
              onClick={() => {
                createproject();
                setSmShow(false);
              }}
              type="button"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
        className="sidebar"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Update Contact
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={Name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                placeholder="Enter Description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </Form.Group>
            {/* <Form.Group className="mb-3">
              <Form.Label>Assignee</Form.Label>
              <Form.Control
                type="text"
                placeholder="Assignee"
                value={assignee}
                id="assignee"
                onChange={(e) => {
                  setAssignee(e.target.value);
                }}
              />
            </Form.Group> */}
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startdate}
                id="startDate"
                onChange={(e) => {
                  setStartdate(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={enddate}
                id="endDate"
                onChange={(e) => {
                  setEnddate(e.target.value);
                }}
              />
            </Form.Group>

            <Button
              variant="primary"
              onClick={() => {
                updateproject(updateContactId);
                setLgShow(false);
              }}
              type="button"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default Project;
