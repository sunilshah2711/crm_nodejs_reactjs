import React from "react";
import { Link } from "react-router-dom";
import { Container, Navbar, Nav, NavDropdown, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faBullhorn, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { GoogleLogout } from "react-google-login";
import { useNavigate, useParams } from "react-router-dom";

import "./Navbar.scss";

import Logo from "../../assets/images/logo.png";

// Navigation bar design

const Navigation = () => {
  const { workspaceid } = useParams();
  const navigate = useNavigate();
  const onSignoutSuccess = () => {
    localStorage.clear();
    navigate("/login");
  };

  const onSignoutFail = (res) => {
    console.log(res);
  };
  return (
    <>
      <Navbar bg="light" expand="lg" className="navmain">
        <Container fluid>
          <Navbar.Brand className="nav-logo">
            <Link to="/">
              <img src={Logo} alt="logo" />
            </Link>
          </Navbar.Brand>

          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              activeKey="/"
            >
              <Nav.Link as="li" eventKey="/">
                <Link to={`/${workspaceid}/contacts`}>Contacts</Link>
              </Nav.Link>
              <NavDropdown
                title={[
                  <span key="drop1">
                    Sales
                    <FontAwesomeIcon icon={faAngleDown} />
                  </span>,
                ]}
                className="nav-dropdown"
              >
                <NavDropdown.Item as="li">Deals</NavDropdown.Item>
                <NavDropdown.Item as="li">Quotes</NavDropdown.Item>
                <NavDropdown.Item as="li">Cadences</NavDropdown.Item>
                <NavDropdown.Item as="li">Meeting Links</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title={[
                  <span key="drop2">
                    Marketing
                    <FontAwesomeIcon icon={faAngleDown} />
                  </span>,
                ]}
                className="nav-dropdown"
              >
                <NavDropdown.Item as="li">Campaigns</NavDropdown.Item>
                <NavDropdown.Item as="li">Automations</NavDropdown.Item>
                <NavDropdown.Item as="li">Email Templates</NavDropdown.Item>
                <NavDropdown.Item as="li">Senders</NavDropdown.Item>
                <NavDropdown.Item as="li">Image Library</NavDropdown.Item>
                <NavDropdown.Item as="li">Lists</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title={[
                  <span key="drop3">
                    Projects
                    <FontAwesomeIcon icon={faAngleDown} />
                  </span>,
                ]}
                className="nav-dropdown"
              >
                <NavDropdown.Item as="li">
                  <Link to={`/${workspaceid}/projects`}>Projects</Link>
                </NavDropdown.Item>
                <NavDropdown.Item as="li">Tasks</NavDropdown.Item>
                <NavDropdown.Item as="li">Filters</NavDropdown.Item>
                <NavDropdown.Item as="li">Labels</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as="li" eventKey="chat-with-support">
                <Link to="/">Check-ins</Link>
              </Nav.Link>
            </Nav>
            <div className="nav-right-bar">
              <Nav.Link>
                <FontAwesomeIcon icon={faBullhorn} />
              </Nav.Link>
              <Nav.Link>
                <FontAwesomeIcon icon={faBell} />
              </Nav.Link>
              <Dropdown align="end" className="profile-dropdown-menu">
                <Dropdown.Toggle>
                  <div className="profile-avtar"></div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Profile</Dropdown.Item>
                  <Dropdown.Item>Admin</Dropdown.Item>
                  <Dropdown.Item>Switch Workspace</Dropdown.Item>
                  <Dropdown.Item>Recycle Bin</Dropdown.Item>
                  <GoogleLogout
                    clientId="966211017574-14b3bp0n0nqrcm4u1k4o0i2h6753qvn6.apps.googleusercontent.com"
                    onLogoutSuccess={onSignoutSuccess}
                    onFailure={onSignoutFail}
                    redirectUri="https://dev.podamium.com"
                    render={(renderProps) => (
                      <Dropdown.Item
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                      >
                        Log Out
                      </Dropdown.Item>
                    )}
                  />
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
