import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import View from "./View";

const Dashboard = () => {
  return (
    <>
      <div className="d-flex w-100">
        <Sidebar />
        <div className="w-100">
          <Navbar />
          <View />
        </div>
      </div>
    </>
  );
};

export default Dashboard;