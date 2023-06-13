import { HelmetProvider } from "react-helmet-async";
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/scss/global.scss";
import Protected from "./pages/Protected/Protected";
import Dashbord from "./pages/Dashbord/Dashbord";
import Auth from "./pages/Auth/Auth";
import Workspace from "./pages/Workspace/Workspace";
import WorkspaceCreate from "./pages/Workspace/WorkspaceCreate";
import WorkspaceUpdate from "./pages/Workspace/WorkspaceUpdate";
import Project from "./pages/Project/Project";
import ProjectDetail from "./pages/ProductDetail/ProductDetail";

// All Route

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <>
      <HelmetProvider>
        <Routes>
          <Route path="/" element={<Protected />}>
            <Route path="/:workspaceid/contacts" element={<Dashbord />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/" element={<Workspace />} />
            <Route path="/workspace-create" element={<WorkspaceCreate />} />
            <Route
              path="/workspace/:id/update/:workname"
              element={<WorkspaceUpdate />}
            />
            <Route path="/:workspaceid/projects" element={<Project />} />
            <Route path="/:workspaceid/task/get" element={<ProjectDetail />} />
          </Route>
          <Route path="/login" element={<Auth />} />
        </Routes>
      </HelmetProvider>
    </>
  );
}

export default App;
