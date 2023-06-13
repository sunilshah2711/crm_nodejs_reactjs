import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Container, Tab, Row, Col } from "react-bootstrap";
import Navbar from "../../components/Navbar/Navbar";
import ProjectTabs from "../../components/ProjectTabs/ProjectTabs";
import ProjectBord from "../../components/ProjectBord/ProjectBord";
import ProjectTimeline from "../../components/ProjectTimeline/ProjectTimeline";
import ProjectFilter from "../../components/ProjectFilter/ProjectFilter";

// import styles from "./ProductDetail.module.scss";

// Product detail page

const ProductDetail = () => {
  const [filterdata, setFilterdata] = useState({});
  console.log(filterdata);
  const passData = (data) => {
    setFilterdata(data);
  };

  const smartfilter = [
    {
      name: "Unassigned",
      key: "Unassigned",
    },
    {
      name: "Unread",
      key: "Unread",
    },
    {
      name: "Unchanged",
      key: "Unchanged",
    },
    {
      name: "No Comment - All Time",
      key: "No Comment - All Time",
    },
    {
      name: "No Comment - Last 7 Days",
      key: "No Comment - Last 7 Days",
    },
    {
      name: "No Comment - Last 30 Days",
      key: "No Comment - Last 30 Days",
    },
    {
      name: "Some Comment - All Time",
      key: "Some Comment - All Time",
    },
    {
      name: "Some Comment - Last 7 Days",
      key: "Some Comment - Last 7 Days",
    },
    {
      name: "Some Comment - Last 30 Days",
      key: "Some Comment - Last 30 Days",
    },
    {
      name: "No Progress Updates - All Time",
      key: "No Progress Updates - All Time",
    },
    {
      name: "No Progress Updates - Last 7 Days",
      key: "No Progress Updates - Last 7 Days",
    },
    {
      name: "No Progress Updates - Last 30 Days",
      key: "No Progress Updates - Last 30 Days",
    },
  ];
  const regularfilter = [
    {
      name: "Name",
      key: "Name",
    },
    {
      name: "Description",
      key: "Description",
    },
    {
      name: "Status",
      key: "Status",
    },
    {
      name: "Active Sprint",
      key: "Active Sprint",
    },
    {
      name: "Due Date",
      key: "Due Date",
    },
    {
      name: "Start Date",
      key: "Start Date",
    },

    {
      name: "Archived",
      key: "Archived",
    },
  ];

  return (
    <div>
      <Helmet>
        <title>ProductDetail</title>
      </Helmet>
      <Navbar />
      <Container fluid>
        <Tab.Container defaultActiveKey="board">
          <Row>
            <Col sm={12} md={12} lg={12}>
              <ProjectTabs />
            </Col>
            <Col sm={12} md={3} lg={3}>
              <ProjectFilter
                smartfilter={smartfilter}
                regularfilter={regularfilter}
                filterType="project"
                filterdata={filterdata}
                passData={passData}
              />
            </Col>

            <Col sm={12} md={9} lg={9}>
              <Tab.Content>
                <Tab.Pane eventKey="board">
                  <ProjectBord filter={filterdata} />
                </Tab.Pane>
                <Tab.Pane eventKey="list">
                  <h2>List</h2>
                </Tab.Pane>
                <Tab.Pane eventKey="timeline">
                  <ProjectTimeline />
                </Tab.Pane>
                <Tab.Pane eventKey="backlog">
                  <h2>Backlog</h2>
                </Tab.Pane>
                <Tab.Pane eventKey="done">
                  <h2>Done</h2>
                </Tab.Pane>
                <Tab.Pane eventKey="project-updates">
                  <h2>Project Updates</h2>
                </Tab.Pane>
                <Tab.Pane eventKey="messages">
                  <h2>Messages</h2>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default ProductDetail;
