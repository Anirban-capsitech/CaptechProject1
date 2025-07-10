import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import type { AccountData } from "../Interface/AccountData";
import { LoginSchema } from "../Schemas/LoginSchema";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialAccountData: AccountData = {
  userId: "",
  password: "",
};

const Login = () => {
  const Navigate = useNavigate();
  const [responseError ,setResponseError] = useState(""); 

  useEffect(() => {
    if(sessionStorage.getItem("Token")){
        console.log("Aleady Logged in , Logout for relogin .");
        Navigate(-1);
    }
  } , []) 

  const {handleBlur, handleChange,handleSubmit,touched,values,errors,} = useFormik({
    initialValues: initialAccountData,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      axios
        .post(`https://localhost:7185/login?UserId=${values.userId}&Password=${values.password}`)
        .then((res) => {
          if (res.data) {
            console.log(res.data);
            sessionStorage.setItem("AToken", res.data.accessToken);
            sessionStorage.setItem("RToken", res.data.refreshToken);
            console.log("Gelm");
            Navigate("/dashboard");
          }
        })
        .catch((err) => setResponseError(err.response.data));
    },
  });

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
            src="assets/logo.png"
            style={{ height: "100%" }}
          />
        </div>
        <div className="fs-3 fw-medium myFont mt-4 text-center">Login Form</div>
        <form className="card-body" onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span
              className="input-group-text rounded-start-pill"
              id="basic-addon1"
            >
              User Id .
            </span>
            <input
              type="text"
              className={`form-control rounded-end-pill ${
                errors.userId && touched.userId ? "is-invalid" : ""
              }`}
              placeholder="Type your userid here"
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={handleChange}
              onBlur={handleBlur}
              name="userId"
              value={values.userId}
            />
            {errors.userId && touched.userId? (
            <div className="invalid-feedback">{errors.userId}</div>
          ) : null}
          </div>
          <div className="input-group mb-5">
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
              placeholder="Type your username here"
              aria-label="Password"
              aria-describedby="basic-addon1"
              onChange={handleChange}
              onBlur={handleBlur}
              name="password"
              value={values.password}
            />
            {errors.password && touched.password? (
            <div className="invalid-feedback">{errors.password}</div>
          ) : null}
          </div>

                    {
            responseError ? (
              <div className="alert alert-danger" role="alert">
                {responseError}
              </div>
            ) : null
          }

          <div className="d-flex gap-2 align-items-center justify-content-end">
            <button
              type="submit"
              className="btn btn-primary px-4 py-2 fw-semibold"
            >
              Login
            </button>
            <button
              type="button"
              className="btn btn-outline-success px-4 py-2 fw-semibold"
              onClick={() => Navigate("/signup")}
            >
              SignUp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
