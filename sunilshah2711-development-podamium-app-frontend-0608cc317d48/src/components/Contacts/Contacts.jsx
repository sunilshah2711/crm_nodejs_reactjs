import React, { useMemo, useEffect, useState } from "react";
import DatatableHalf from "../DatatableHalf/DatatableHalf";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./Contacts.module.scss";
import { Button, Modal, Form } from "react-bootstrap";

const Contacts = () => {
  const [contact, setContactList] = useState([]);

  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");

  const [updateContactId, setupdateContactId] = useState("");

  const { workspaceid } = useParams();
  const [smShow, setSmShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Contact No",
        accessor: "contact_no",
      },
      {
        Header: "Created at",
        accessor: "created_at",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) => {
          const row = props.row.original;
          const rowind = props.row.original.uuid;
          const deletecontact = async (rowind) => {
            let auth_code = localStorage.getItem("auth_code");
            axios
              .post(
                `https://api.podamium.com/v1/${workspaceid}/contacts/delete?id=${rowind}`,
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
                contactList(workspaceid);
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
            <div>
              <Button
                onClick={() => {
                  deletecontact(rowind);
                }}
                className="ms-2"
                variant="danger"
              >
                Delete
              </Button>

              <Button
                onClick={() => {
                  setLgShow(true);
                  updatecontactlist(row);
                }}
                className="ms-2"
                variant="primary"
              >
                Update
              </Button>
            </div>
          );
        },
      },
    ],
    [workspaceid]
  );

  // All contact list

  const contactList = async (workspaceid) => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        `https://api.podamium.com/v1/${workspaceid}/contacts/get`,
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
        return setContactList(res.data.data.payload);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Create contact

  const createcontact = async () => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        `https://api.podamium.com/v1/${workspaceid}/contacts/create`,
        {
          name: Name,
          email: Email,
          contact_no: contactNo,
        },
        {
          headers: {
            "content-type": "application/json",
            "x-access-token": auth_code,
          },
        }
      )
      .then((res) => {
        contactList(workspaceid);
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

  // Update contact

  const updatecontactlist = async (row) => {
    setName(row.name);
    setEmail(row.email);
    setContactNo(row.contact_no);
    setupdateContactId(row.uuid);
  };

  const updatecontact = async (row) => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        `https://api.podamium.com/v1/${workspaceid}/contacts/update?id=${row}`,
        {
          name: Name,
          email: Email,
          contact_no: contactNo,
        },
        {
          headers: {
            "content-type": "application/json",
            "x-access-token": auth_code,
          },
        }
      )
      .then((res) => {
        contactList(workspaceid);
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

  useEffect(() => {
    contactList(workspaceid);
  }, [workspaceid]);

  // Create frontend design

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button onClick={() => setSmShow(true)}>Add New Contact</Button>
      </div>
      <DatatableHalf columns={columns} data={contact} />
      <Modal
        size="lg"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Add New Contact
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                id="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Contact No"
                onChange={(e) => {
                  setContactNo(e.target.value);
                }}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={() => {
                createcontact();
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
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={Email}
                placeholder="name@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact No</Form.Label>
              <Form.Control
                type="text"
                value={contactNo}
                placeholder="Enter Contact No"
                onChange={(e) => {
                  setContactNo(e.target.value);
                }}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={() => {
                updatecontact(updateContactId);
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

export default Contacts;
