import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faPenToSquare,
  faTrash,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";

import "./Workspace.scss";

// Workspace list

const Workspace = () => {
  const navigate = useNavigate();

  const [worklist, setWorklist] = useState([]);

  const workspaceList = async () => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        "https://api.podamium.com/v1/workspace",
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
        // console.log(res);
        setWorklist(res.data.data.payload);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Workspace delete

  const deleteWorkspace = async (uuid) => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        `https://api.podamium.com/v1/workspace/delete/${uuid}`,
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
        workspaceList();
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

  useEffect(() => {
    workspaceList();
  }, []);

  // Workspace frontend design

  return (
    <>
      <Helmet>
        <title>Workspace</title>
      </Helmet>
      <div className="workspace-main">
        <div className="workspace-box">
          <h3>Workspace</h3>
          {worklist.map((res) => {
            return (
              <div className="workspace-btn-wrap" key={res.uuid}>
                <button onClick={() => navigate(`/${res.uuid}/contacts`)}>
                  <p>{res.name}</p> <FontAwesomeIcon icon={faFileLines} />
                </button>
                <button
                  onClick={() =>
                    navigate(`/workspace/${res.uuid}/update/${res.name}`)
                  }
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button onClick={() => deleteWorkspace(res.uuid)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            );
          })}
          <button onClick={() => navigate("/workspace-create")}>
            <p>Create New Workspace</p> <FontAwesomeIcon icon={faSquarePlus} />
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Workspace;
