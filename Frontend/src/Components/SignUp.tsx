import React, { useState } from "react";
import type { AccountInfo } from "../Interface/AccountInfo";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { AccountInfoSchema } from "../Schemas/SignUpSchema";
import axiosInstance from "../Utils/Axios";
import Modal from "./Modal";

const initialSignupData: AccountInfo = {
  doB: "",
  email: "",
  mobNo: "",
  name: "",
  password: "",
  confirmpassword:""
};




const SignUp = () => {
  const [responseError, setResponseError] = useState("");

  const [openModal , setOpenModal] = useState(false);

  const [userId , setUserId] = useState("");
  const {
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    values,
    errors,
    resetForm,
  } = useFormik({
    initialValues: initialSignupData,
    validationSchema: AccountInfoSchema,
    onSubmit: (values) => {
      console.log(values);
      axiosInstance.post("/signup", values)
          .then((res) => {
            console.log(res);
            setUserId(res.data.userId);
            setOpenModal(true);
            resetForm();
          })
        .catch((err) => setResponseError(err.response.data));
    },
  });

  const Navigate = useNavigate();

  const handleSignUp = () => {
    console.log("Sign up ");
    Navigate("/login");
  }

  return (
    <div
      className="loginPage m-0 d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div
        className="card p-3 m-3 rounded-3"
        style={{ width: "100%", maxWidth: "500px", minWidth: "300px" }}
      >
        <div
          className="companyHeader text-center"
          style={{ height: "50px", overflow: "hidden" }}
        >
          <img
            className="img-fluid"
            src="../src/assets/logo.png"
            style={{ height: "100%" }}
          />
        </div>
        <div className="fs-3 fw-medium myFont mt-4 text-center">
          Sign Up Form
        </div>
        <form className="card-body" onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span
              className="input-group-text rounded-start-pill"
              id="basic-addon1"
            >
              Name
            </span>
            <input
              type="text"
              className={`form-control rounded-end-pill ${
                errors.name && touched.name ? "is-invalid" : ""
              }`}
              placeholder="Type your 'Full Name' here"
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={handleChange}
              onBlur={handleBlur}
              name="name"
              value={values.name}
            />
            {errors.name && touched.name ? (
              <div className="invalid-feedback">{errors.name}</div>
            ) : null}
          </div>

          <div className="input-group mb-3">
            <span
              className="input-group-text rounded-start-pill"
              id="basic-addon1"
            >
              Email
            </span>
            <input
              type="text"
              className={`form-control rounded-end-pill ${
                errors.email && touched.email ? "is-invalid" : ""
              }`}
              placeholder="Type a valid email id"
              aria-label="Email"
              aria-describedby="basic-addon1"
              onChange={handleChange}
              onBlur={handleBlur}
              name="email"
              value={values.email}
            />
            {errors.email && touched.email ? (
              <div className="invalid-feedback">{errors.email}</div>
            ) : null}
          </div>

          <div className="input-group mb-3">
            <span
              className="input-group-text rounded-start-pill"
              id="basic-addon1"
            >
              Mobile No
            </span>
            <input
              type="tel"
              maxLength={10}
              id="mobNo"
              className={`form-control rounded-end-pill ${
                errors.mobNo && touched.mobNo ? "is-invalid" : ""
              }`}
              placeholder="Enter a valida mobile no"  
              aria-label="MobileNo"
              aria-describedby="basic-addon1"
              onChange={(e) => { 
              if (!isNaN(Number(e.target.value)) || (e.target.value) === "") {
                handleChange(e);
              }
            }}
              onBlur={handleBlur}
              name="mobNo"
              value={values.mobNo}
            />
            {errors.mobNo && touched.mobNo ? (
              <div className="invalid-feedback">{errors.mobNo}</div>
            ) : null}
          </div>

          <div className="input-group mb-3">
            <span
              className="input-group-text rounded-start-pill"
              id="basic-addon1"
            >
              Date of Birth
            </span>
            <input
              type="date"
              className={`form-control rounded-end-pill ${
                errors.doB && touched.doB ? "is-invalid" : ""
              }`}
              placeholder="Enter Date of Birth here"
              aria-label="DateBirth"
              aria-describedby="basic-addon1"
              onChange={handleChange}
              onBlur={handleBlur}
              name="doB"
              value={values.doB}
            />
            {errors.doB && touched.doB ? (
              <div className="invalid-feedback">{errors.doB}</div>
            ) : null}
          </div>

          <div className="input-group mb-3">
            <span
              className="input-group-text rounded-start-pill"
              id="basic-addon1"
            >
              Password
            </span>
            <input
              type="password"
              className={`form-control rounded-end-pill ${
                errors.password && touched.password ? "is-invalid" : ""
              }`}
              placeholder="Type your password here"
              aria-label="Password"
              aria-describedby="basic-addon1"
              onChange={handleChange}
              onBlur={handleBlur}
              name="password"
              value={values.password}
            />
            {errors.password && touched.password ? (
              <div className="invalid-feedback">{errors.password}</div>
            ) : null}
          </div>

          <div className="input-group mb-5">
            <span
              className="input-group-text rounded-start-pill"
              id="basic-addon1"
            >
              Confirm Password
            </span>
            <input
              type="password"
              className={`form-control rounded-end-pill ${
                errors.confirmpassword && touched.confirmpassword ? "is-invalid" : ""
              }`}
              placeholder="Type your password here"
              aria-label="confirmPass"
              aria-describedby="basic-addon1"
              onChange={handleChange}
              onBlur={handleBlur}
              name="confirmpassword"
              value={values.confirmpassword}
            />
            {errors.confirmpassword && touched.confirmpassword ? (
              <div className="invalid-feedback">{errors.confirmpassword}</div>
            ) : null}
          </div>

          {responseError ? (
            <div className="alert alert-danger" role="alert">
              {responseError}
            </div>
          ) : null}

          <div className="d-flex gap-2 align-items-center justify-content-end">
            <button
              type="submit"
              className="btn btn-success px-4 py-2 fw-semibold"
            >
              Sign Up
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary px-4 py-2 fw-semibold"
              onClick={() => Navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {openModal ? (
          <Modal
            question={`Your user Id is : (${userId}) . Now login again to start.`}
            setModel={setOpenModal}
            actionFuction={handleSignUp}
          />
        ) : null}
    </div>
  );
};

export default SignUp;
