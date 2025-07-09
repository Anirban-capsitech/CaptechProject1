import React from "react";
import type { billList } from "./Attendee";
import { useFormik } from "formik";
import type { Attendee } from "../Interface/Attendee";
import axiosInstance from "../Utils/Axios";
import { AttendeeSchema } from "../Schemas/AddAttendeeSchema";

interface props {
  triggerOffCanvas: () => void;
  reloadData:(val : boolean) => void;
  BillList: billList[];
}

const InitialUSerData: Attendee = {
  attendeeName: "",
  dept: "",
  billNo: "",
};

const AddDoctor: React.FC<props> = ({ triggerOffCanvas, BillList , reloadData}) => {
  const { handleChange, handleSubmit, touched, errors, values , handleBlur , resetForm} = useFormik({
    initialValues: InitialUSerData,
    validationSchema : AttendeeSchema,
    onSubmit: (values) => {
      axiosInstance.post("/addattendee", values)
        .then((res) => {
          resetForm();
          reloadData(true);
          triggerOffCanvas();
        })
        .catch((err) => console.log(err));

    },
  });
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label htmlFor="name" className="form-label">
          Bill No.
        </label>
        <select
          className={`form-select ${errors.billNo && touched.billNo ? "is-invalid": ""}`}
          aria-label="Default select example"
          value={values.billNo}
          name="billNo"
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="" selected>
            Select a Bill
          </option>
          {BillList.map((item) => {
            return <option value={item.billNo}>{item.billNo}</option>;
          })}
        </select>

        {errors.billNo && touched.billNo ? (
            <div className="invalid-feedback">{errors.billNo}</div>
        ) : null}
      </div>

      <div className="mb-2">
        <label htmlFor="attendeeName" className="form-label">
          Attendee Name
        </label>
        <input
          className={`form-control ${errors.attendeeName && touched.attendeeName ? "is-invalid": ""}`}
          type="text"
          placeholder="Enter the attendee name"
          value={values.attendeeName}
          name="attendeeName"
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {errors.attendeeName && touched.attendeeName ? (
            <div className="invalid-feedback">{errors.attendeeName}</div>
        ) : null}
      </div>

      <div className="mb-2">
        <label htmlFor="depatment" className = "form-label">
          Deparment
        </label>
        <input
          className={`form-control ${errors.dept && touched.dept ? "is-invalid": ""}`}
          type="text"
          placeholder="Enter the deparment name"
          value={values.dept}
          name="dept"
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {errors.dept && touched.dept ? (
            <div className="invalid-feedback">{errors.attendeeName}</div>
        ) : null}
      </div>

      <div className="d-flex justify-content-end mt-3 myFont gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100px" }}
        >
          Save
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={triggerOffCanvas}
          style={{ width: "100px" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
