import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "./Workspace.scss";

// Workspace update

const WorkspaceUpdate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { id } = useParams();
  const { workname } = useParams();
  // console.log(name);
  const createWorkspace = async () => {
    let auth_code = localStorage.getItem("auth_code");

    axios
      .post(
        `https://api.podamium.com/v1/workspace/update/${id}`,
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
        // console.log(name);
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
        if (error.response.data.data.message === "Validation failed") {
          toast.error(`${error.response.data.data.payload[0]}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else {
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
        }
      });
  };

  useEffect(() => {
    setName(workname);
  }, [workname]);

  // Workspace frontend design

  return (
    <>
      <Helmet>
        <title>Workspace Update</title>
      </Helmet>
      <div className="workspace-main">
        <div className="workspace-box">
          <h3>Workspace Update</h3>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                name="workName"
                type="text"
                placeholder="Workspace name"
                value={name}
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

export default WorkspaceUpdate;
