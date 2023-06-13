import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "./Workspace.scss";

// Workspace create

const WorkspaceCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const createWorkspace = async () => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        "https://api.podamium.com/v1/workspace/create",
        {
          name,
        },
        {
          headers: {
            "content-type": "application/json",
            "x-access-token": auth_code,
          },
        }
      )
      .then((res) => {
        navigate("/workspace");
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

  // Workspace create design

  return (
    <>
      <Helmet>
        <title>Workspace Create</title>
      </Helmet>
      <div className="workspace-main">
        <div className="workspace-box">
          <h3>Workspace Create</h3>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                name="workName"
                type="text"
                placeholder="Workspace name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <Form.Text className="text-muted">
                Please enter your workspace name.
              </Form.Text>
            </Form.Group>
            <button onClick={createWorkspace} type="button">
              Submit
            </button>
          </Form>
          <button onClick={() => navigate("/workspace")}>
            <p>Back To Workspace</p>
            <p></p>
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default WorkspaceCreate;
