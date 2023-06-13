import React from "react";
import { Row, Col, Nav } from "react-bootstrap";
import styles from "./ProjectTabs.module.scss";
import "./ProjectTabs.scss";

// Project tabs design

const ProjectTabs = () => {
  return (
    <>
      <Row>
        <Col sm={12} md={12} lg={12}>
          <Nav className={styles.ProjectTabs}>
            <Nav.Item>
              <Nav.Link as="li" eventKey="board">
                Board
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as="li" eventKey="list">
                List
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as="li" eventKey="timeline">
                Timeline
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as="li" eventKey="backlog">
                Backlog
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as="li" eventKey="done">
                Done
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as="li" eventKey="project-updates">
                Project Updates
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as="li" eventKey="messages">
                Messages
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
    </>
  );
};

export default ProjectTabs;
