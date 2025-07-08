import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const Navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("AToken");
    sessionStorage.removeItem("RToken");
    Navigate("/login");
  }
  
  return (
    <nav className="navbar top-0 bg-primary py-2 z-0" style={{position:'sticky'}}>
      <div className="w-100 d-flex justify-content-end">
        <div className="ProfileLogo mx-2">
            {/* <img className="" src=".src/assets/logo.png" /> */}
            <button className="btn btn-success" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i> Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
