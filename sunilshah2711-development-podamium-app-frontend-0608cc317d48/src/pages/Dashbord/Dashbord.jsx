import React from "react";
import { Helmet } from "react-helmet-async";

import Navbar from "../../components/Navbar/Navbar";
import Contacts from "../../components/Contacts/Contacts";
import "./Dashbord.scss";

// Dashbord main page

const Dashbord = () => {
  return (
    <>
      <Helmet>
        <title>Contacts</title>
      </Helmet>
      <Navbar />
      <div className="container-fluid">
        <div className="page-wrap">
          <Contacts />
        </div>
      </div>
    </>
  );
};

export default Dashbord;
