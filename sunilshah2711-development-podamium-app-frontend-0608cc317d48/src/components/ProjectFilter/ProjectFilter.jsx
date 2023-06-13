import React, { useState, useEffect } from "react";
import { Tab, Nav, Form, Modal, Button } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import styles from "./ProjectFilter.module.scss";
import Checkbox from "../Checkbox/Checkbox";
import "./ProjectFilter.scss";

// Project filter design

const ProjectFilter = (filters) => {
  const { workspaceid } = useParams();
  const [checkedItems, setCheckedItems] = useState({});
  const [savedItems, setSavedItems] = useState({});
  const [regularInput, setRegularInput] = useState("");
  const [regularSelect, setRegularSelect] = useState("");
  const [regularFilterName, setRegularFilterName] = useState("");
  const [regularFilterValue, setRegularFilterValue] = useState("");
  const [allData, setAllData] = useState([]);

  const [show, setShow] = useState(false);
  const [saveshow, setSaveshow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const savehandleClose = () => setSaveshow(false);
  const savehandleShow = () => setSaveshow(true);

  // console.log(filters);

  console.log(allData);
  // if (checkedItems !== "") {
  //   Object.keys((checkedItems) => {
  //     console.log();
  //   });
  // }

  useEffect(
    () => {
      const newArrey = [...allData];
      const index = newArrey.findIndex(
        (el) => el.regularFilterName === regularFilterName
      );
      if (index === -1) {
        if (regularFilterName !== "") {
          newArrey.push({ regularFilterName, regularInput, regularSelect });
        }
      } else {
        if (regularFilterValue === false) {
          newArrey.splice(index, 1);
        } else {
          newArrey[index] = { regularFilterName, regularInput, regularSelect };
        }
      }

      setAllData(newArrey);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [regularFilterName, regularInput, regularSelect, regularFilterValue]
  );

  const runFilter = () => {
    filters.passData({ checkedItems });
  };

  const uncheckAll = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const handleChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
    setRegularFilterName(event.target.name);
    setRegularFilterValue(event.target.checked);
  };

  const [name, setName] = useState("");
  const filter_type = filters.filterType;

  const filterlist = async (workspaceid, filter_type) => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        `https://api.podamium.com/v1/${workspaceid}/filter/getbytype`,
        {
          filter_type: filter_type,
          page_no: 1,
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
        setSavedItems(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const savefilter = async () => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        `https://api.podamium.com/v1/${workspaceid}/filter/save`,
        {
          name: name,
          filter_type: filter_type,
          smart_filter: checkedItems,
        },
        {
          headers: {
            "content-type": "application/json",
            "x-access-token": auth_code,
          },
        }
      )
      .then((res) => {
        filterlist(workspaceid, filter_type);
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

  const saveasfilter = async () => {
    let auth_code = localStorage.getItem("auth_code");
    axios
      .post(
        `https://api.podamium.com/v1/${workspaceid}/filter/saveas`,
        {
          name: name,
          filter_type: filter_type,
          smart_filter: checkedItems,
        },
        {
          headers: {
            "content-type": "application/json",
            "x-access-token": auth_code,
          },
        }
      )
      .then((res) => {
        filterlist(workspaceid, filter_type);
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
    filterlist(workspaceid, filter_type);
  }, [workspaceid, filter_type]);

  return (
    <>
      <div className={styles.projectHeding}>
        <h2>Project Name</h2>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Filter</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Filter Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                savefilter();
                setShow(false);
              }}
            >
              Add Filter
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={saveshow} onHide={savehandleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Filter</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Filter Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                saveasfilter();
                setSaveshow(false);
              }}
            >
              Add Filter
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Form.Select
        className="mb-3"
        defaultValue={"DEFAULT"}
        onChange={(e) => {
          var index = e.nativeEvent.target.selectedIndex;
          setName(e.nativeEvent.target[index].text);
          setCheckedItems(JSON.parse(e.target.value));
        }}
      >
        <option value="DEFAULT" disabled>
          Choose filter
        </option>
        {Array.from(savedItems).map((item) => {
          return (
            <option key={item.uuid} value={item.smart_filter}>
              {item.name}
            </option>
          );
        })}
      </Form.Select>
      <div className="filter-tabs">
        <Tab.Container defaultActiveKey="filters">
          <Nav>
            <Nav.Item>
              <Nav.Link as="li" eventKey="filters">
                Conditions
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as="li" eventKey="groups">
                Columns
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as="li" eventKey="groups">
                Labels
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="filters">
              <div className={styles.filtersDetail}>
                <h3>Smart Properties</h3>
                <div className={styles.filtersDetailWrap}>
                  {filters.smartfilter.map((item) => (
                    <div className={styles.filterCheckbox} key={item.key}>
                      <Checkbox
                        Name={item.name}
                        Checked={checkedItems[item.name]}
                        Change={uncheckAll}
                        Tag={[
                          <span
                            key={item.key}
                            onClick={() => setCheckedItems((c) => !c)}
                          >
                            Only this
                          </span>,
                        ]}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.filtersDetail}>
                <h3 className="mt-4">Regular Properties</h3>
                <div className={styles.filtersDetailWrap}>
                  {filters.regularfilter.map((item) => (
                    <div key={item.key}>
                      <Checkbox
                        Name={item.name}
                        Checked={checkedItems[item.name]}
                        // Class={item.key}
                        Change={(e) => {
                          setRegularFilterName(e.target.name);
                          setRegularSelect("");
                          setRegularInput("");
                          handleChange(e);
                        }}
                      />
                      {checkedItems[item.name] && (
                        <>
                          <Form.Select
                            defaultValue={"DEFAULT"}
                            className="mt-1"
                            onChange={(e) => {
                              setRegularFilterName(item.name);
                              setRegularSelect(e.target.value);
                            }}
                          >
                            <option value="DEFAULT" disabled>
                              Open this select menu
                            </option>
                            <option>Equal</option>
                            <option>Not Equal</option>
                            <option>Contains</option>
                            <option>less Than</option>
                            <option>Greater Than</option>
                          </Form.Select>
                          <Form.Control
                            className="mt-2 mb-3"
                            type="text"
                            placeholder="Enter value"
                            onChange={(e) => {
                              setRegularFilterName(item.name);
                              setRegularInput(e.target.value);
                            }}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.filtersButton}>
                <button
                  onClick={() => {
                    runFilter();
                    // saveData();
                  }}
                >
                  Run
                </button>
                {name ? (
                  <button
                    onClick={() => {
                      savefilter();
                    }}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleShow();
                    }}
                  >
                    Save
                  </button>
                )}

                <button onClick={savehandleShow}>Save As</button>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="groups">
              <div className={styles.filtersDetail}>
                <h3>Contact Properties</h3>
                <div className={styles.filtersDetailWrap}>
                  {filters.regularfilter.map((item) => (
                    <div key={item.key}>
                      <Checkbox
                        Name={item.name}
                        Checked={checkedItems[item.name]}
                        Change={() => {
                          handleChange();
                        }}
                      />
                      {checkedItems[item.name] && (
                        <>
                          <Form.Select className="mt-1">
                            <option>Open this select menu</option>
                            <option value="1">=</option>
                            <option value="2">+</option>
                            <option value="3">-</option>
                            <option value="4">%</option>
                          </Form.Select>
                          <Form.Control
                            className="mt-2 mb-3"
                            type="text"
                            placeholder="Enter value"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.filtersButton}>
                <button>Run</button>
                <button>Save</button>
                <button>Save As</button>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProjectFilter;
