import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import View from "./View";
import { Route, Routes } from "react-router-dom";
import Attendee from "./Attendee";
import ProtectedRoute from "./ProtectedRoute";

const Dashboard = () => {
  return (
    <>
      <div className="d-flex w-100">
        <Sidebar />
        <div className="w-100">
          <Navbar />
          <Routes>
              <Route path="/" element={<View />} />
              <Route path="/attendee" element={<Attendee />} />
          </Routes>
        </div>
      </div>
    </>
  );
};


export default Dashboard;