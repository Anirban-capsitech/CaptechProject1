import { useState } from "react";
import '../Styles/sidebar.css'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div
        className={`sidebar bg-light py-1 overflow-visible z-3 ${collapsed ? "collapsed" : "" }`}
      >
        <div className="companyLogo px-3 position-relative d-flex align-items-center justify-content-center" style={{height : '70px'}}>
          <button type="button" className="rounded-circle cursor-pointer border d-flex align-items-center justify-content-center bg-light position-absolute" 
                style={{height: "30px" , width : "30px", right:"-12px" , top: "5px"}}
                onClick={() => setCollapsed(!collapsed)}
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          <img className="w-auto p-2" src={`./src/assets/${collapsed ? "logo_sm.png" : "logo.png"}`}
            style={{height: "100%"}} alt="Company logo"
          />
        </div>

        <ul className="sideMenubar nav flex-column mt-3">
          <li className="nav-item">
            <a href="#" className="nav-link active">
              <i className="bi bi-house-door-fill text-primary fs-5"></i>
              {!collapsed && <span className="ms-2 text-dark">Dashboard</span>}
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="bi bi-calendar2-week-fill text-primary fs-5"></i>
              {!collapsed && <span className="ms-2 text-dark">Leaves</span>}
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="bi bi-people-fill text-primary fs-5"></i>
              {!collapsed && <span className="ms-2 text-dark">Attendence Request</span>}
            </a>
          </li>

          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="bi bi-graph-up-arrow text-primary fs-5"></i>
              {!collapsed && <span className="ms-2 text-dark">Reorts</span>}
            </a>
          </li>

          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="bi bi-calendar2-check-fill text-primary fs-5"></i>
              {!collapsed && <span className="ms-2 text-dark">Events</span>}
            </a>
          </li>

          <li className="nav-item">
            <a href="#" className="nav-link">
              <i className="bi bi-file-earmark-text-fill text-primary fs-5"></i>
              {!collapsed && <span className="ms-2 text-dark">Company policies</span>}
            </a>
          </li>

        </ul>
      </div>
    </>
  );
};

export default Sidebar;
