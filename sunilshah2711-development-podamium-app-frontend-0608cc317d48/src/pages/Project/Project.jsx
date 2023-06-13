import React from "react";
import { Helmet } from "react-helmet-async";
import { Container } from "react-bootstrap";
import Navbar from "../../components/Navbar/Navbar";
import ProjectTabel from "../../components/Project/Project";

import "./Project.module.scss";

// Project main page

const Project = () => {
  return (
    <>
      <Helmet>
        <title>Project</title>
      </Helmet>
      <Navbar />
      <Container fluid>
        <div className="page-wrap">
          <ProjectTabel />
        </div>
      </Container>
    </>
  );
};

export default Project;
