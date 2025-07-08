import React, { useEffect } from "react";
import "../Styles/view.css";
import { useFormik } from "formik";
import type { User, ItemDetail } from "../Interface/UserData";
import { UserSchema } from "../Schemas/UserSchema.tsx";
import axiosInstance from "../Utils/Axios.ts";

interface props {
  triggerOffCanvas: () => void;
  reloadData: (data: boolean) => void;
  formData : User;
  btnText : string
}

const AddForm: React.FC<props> = ({ triggerOffCanvas, reloadData ,formData , btnText}) => {
  const {handleBlur,handleChange,handleSubmit,touched,values,errors,setFieldValue,resetForm,setValues} = useFormik({
    initialValues: formData,
    validationSchema: UserSchema,
    onSubmit: (values) => {
      axiosInstance.post("/UserData", values)
          .then((response) => {
            console.log(response);
            resetForm();
            triggerOffCanvas();
            reloadData(true);
          })
        .catch((err) => console.error(err));
    },
  });

  useEffect(() => {
    setValues(formData);
  },[formData])

useEffect(() => {
  console.log(values);
  const updatedItems = values.itemDetails.map((item) => {
    const quantity = Number(item.quantity);
    const price = Number(item.price) || 0;
    const gst = Number(item.gst) || 0;

    const amount = parseFloat((quantity * price * (1 + gst / 100)).toFixed(2));
    return { ...item, amount };
  });

  const hasChanged = updatedItems.some((item, index) => item.amount !== values.itemDetails[index].amount);

  if (hasChanged) {
    setFieldValue("itemDetails", updatedItems);
  }
}, [values.itemDetails, setFieldValue]);


  
  const handleAddItem = () => {
    const newItem = {
      itemDesc: "",
      quantity: "",
      price: "",
      gst: "",
      amount: 0,
    };

    setFieldValue("itemDetails", [...values.itemDetails, newItem]);
  };

  const handleRemoveItem = (index : number) =>{
    if(values.itemDetails.length > 1){
      var newItem = values.itemDetails.splice(index, 1);
      setFieldValue("itemDetails", [newItem]);
    }else{
      alert("Atleast 1 response needed");
    }
    
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-4 fw-semibold fs-6">Personal Details</p>
      <div className="row g-2 myFont">
        <div className="col-sm-4">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className={`form-control ${
              errors.personalDetails?.name && touched.personalDetails?.name
                ? "is-invalid"
                : ""
            }`}
            id="name"
            name="personalDetails.name"
            value={values.personalDetails.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.personalDetails?.name && touched.personalDetails?.name ? (
            <div className="invalid-feedback">
              {errors.personalDetails?.name}
            </div>
          ) : null}
        </div>

        <div className="col-sm-4">
          <label htmlFor="eamil" className="form-label">
            Email Id
          </label>
          <input
            type="email"
            className={`form-control ${
              errors.personalDetails?.email && touched.personalDetails?.email
                ? "is-invalid"
                : ""
            }`}
            id="email"
            name="personalDetails.email"
            value={values.personalDetails.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {errors.personalDetails?.email && touched.personalDetails?.email ? (
            <div className="invalid-feedback">
              {errors.personalDetails?.email}
            </div>
          ) : null}
        </div>

        <div className="col-sm-4">
          <label htmlFor="phoneNo" className="form-label">
            Phone No
          </label>
          <input
            type="tel"
            className={`form-control ${
              errors.personalDetails?.phNo && touched.personalDetails?.phNo
                ? "is-invalid"
                : ""
            }`}
            id="phoneNo"
            name="personalDetails.phNo"
            value={values.personalDetails.phNo}
            onChange={(e) => { 
              if (!isNaN(Number(e.target.value)) || (e.target.value) === "") {
                handleChange(e);
              }
            }}
            onBlur={handleBlur}
            maxLength={10}
          />
          {errors.personalDetails?.phNo && touched.personalDetails?.phNo ? (
            <div className="invalid-feedback">
              {errors.personalDetails?.phNo}
            </div>
          ) : null}
        </div>
      </div>
      <p className="mt-4 mb-4 fw-semibold fs-6">Address</p>
      <div className="row g-2 myFont">
        <div className="col-sm-4">
          <label htmlFor="building" className="form-label">
            Building
          </label>
          <input
            type="text"
            className={`form-control ${
              errors.address?.building && touched.address?.building
                ? "is-invalid"
                : ""
            }`}
            id="building"
            name="address.building"
            value={values.address.building}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {errors.address?.building && touched.address?.building ? (
            <div className="invalid-feedback">{errors.address?.building}</div>
          ) : null}
        </div>
        <div className="col-sm-4">
          <label htmlFor="street" className="form-label">
            Street
          </label>
          <input
            type="text"
            className={`form-control ${
              errors.address?.street && touched.address?.street
                ? "is-invalid"
                : ""
            }`}
            id="street"
            name="address.street"
            value={values.address.street}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {errors.address?.street && touched.address?.street ? (
            <div className="invalid-feedback">{errors.address?.street}</div>
          ) : null}
        </div>
        <div className="col-sm-4">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            className={`form-control ${
              errors.address?.city && touched.address?.city ? "is-invalid" : ""
            }`}
            id="city"
            name="address.city"
            value={values.address.city}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.address?.city && touched.address?.city ? (
            <div className="invalid-feedback">{errors.address?.city}</div>
          ) : null}
        </div>

        <div className="col-sm-4">
          <label htmlFor="street" className="form-label">
            State
          </label>
          <input
            type="state"
            className={`form-control ${
              errors.address?.state && touched.address?.state
                ? "is-invalid"
                : ""
            }`}
            id="state"
            name="address.state"
            value={values.address.state}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {errors.address?.state && touched.address?.state ? (
            <div className="invalid-feedback">{errors.address?.state}</div>
          ) : null}
        </div>
        <div className="col-sm-4">
          <label htmlFor="country" className="form-label">
            Country
          </label>
          <input
            type="country"
            className={`form-control ${
              errors.address?.country && touched.address?.country
                ? "is-invalid"
                : ""
            }`}
            id="country"
            name="address.country"
            value={values.address.country}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.address?.country && touched.address?.country ? (
            <div className="invalid-feedback">{errors.address?.country}</div>
          ) : null}
        </div>
      </div>

      <p className="mt-4 mb-3 fw-semibold fs-6">Item Details</p>
      {values.itemDetails.map((item: ItemDetail, index) => {
        return (
          <div key={index}>
            <p className="myFont mt-3 ms-3 mb-1">Item {index + 1}</p>
            <hr className="my-1" />
            <div className="row g-2 myFont">
              <div className="col-sm-4">
                <label htmlFor="itemdesc" className="form-label">
                  Description
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    (errors.itemDetails?.[index] as any)?.itemDesc &&
                    touched.itemDetails?.[index]?.itemDesc
                      ? "is-invalid"
                      : ""
                  }`}
                  id="itemdesc"
                  name={`itemDetails[${index}].itemDesc`}
                  value={item.itemDesc}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {(errors.itemDetails?.[index] as any)?.itemDesc &&
                touched.itemDetails?.[index]?.itemDesc ? (
                  <div className="invalid-feedback">
                    {(errors.itemDetails?.[index] as any)?.itemDesc}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-4">
                <label htmlFor="quantity" className="form-label">
                  Quantity
                </label>
                <input
                  type="number"
                  className={`form-control ${
                    (errors.itemDetails?.[index] as any)?.quantity &&
                    touched.itemDetails?.[index]?.quantity
                      ? "is-invalid"
                      : ""
                  }`}
                  id="quantity"
                  name={`itemDetails[${index}].quantity`}
                  value={item.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {(errors.itemDetails?.[index] as any)?.quantity &&
                touched.itemDetails?.[index]?.quantity ? (
                  <div className="invalid-feedback">
                    {(errors.itemDetails?.[index] as any)?.quantity}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-4">
                <label htmlFor="itemPrice" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  className={`form-control ${
                    (errors.itemDetails?.[index] as any)?.price &&
                    touched.itemDetails?.[index]?.price
                      ? "is-invalid"
                      : ""
                  }`}
                  id="itemPrice"
                  name={`itemDetails[${index}].price`}
                  value={item.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {(errors.itemDetails?.[index] as any)?.price &&
                touched.itemDetails?.[index]?.price ? (
                  <div className="invalid-feedback">
                    {(errors.itemDetails?.[index] as any)?.price}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-4">
                <label htmlFor="itemGst" className="form-label">
                  GST %
                </label>
                <input
                  type="number"
                  className={`form-control ${
                    (errors.itemDetails?.[index] as any)?.gst &&
                    touched.itemDetails?.[index]?.gst
                      ? "is-invalid"
                      : ""
                  }`}
                  id="itemGst"
                  name={`itemDetails[${index}].gst`}
                  value={item.gst}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {(errors.itemDetails?.[index] as any)?.gst &&
                touched.itemDetails?.[index]?.gst ? (
                  <div className="invalid-feedback">
                    {(errors.itemDetails?.[index] as any)?.gst}
                  </div>
                ) : null}
              </div>

              <div className="col-sm-4">
                <label htmlFor="amt" className="form-label">
                  Amount
                </label>
                <input
                  disabled
                  type="number"
                  className="form-control"
                  id="amt"
                  name={`itemDetails[${index}].amount`}
                  value={item.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              {
                values.itemDetails.length > 1 ?
                <div className="removeForm col-sm-4 d-flex  align-items-end">
                  <button type="button" className="btn" style={{height:"40px"}}
                    onClick={() => {
                      handleRemoveItem(index);
                    }}
                  ><i className="bi bi-trash text-danger fs-6"></i></button>
                </div> : null
              }
            </div>
          </div>
        );
      })}

      <button
        type="reset"
        className="btn btn-primary mt-3"
        onClick={handleAddItem}
        style={{ width: "100px" }}
      >
        Add
      </button>

      <p className="mt-4 mb-4 fw-semibold fs-6">Payment Details</p>

      <div className="row g-2 myFont">
        <div className="col-sm-4">
          <label htmlFor="paid" className="form-label">
            Paid Amount
          </label>
          <input
            type="number"
            className={`form-control ${errors.payment?.paidAmount && touched.payment?.paidAmount? "is-invalid": ""}`}
            id="paid"
            name="payment.paidAmount"
            value={values.payment.paidAmount}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.payment?.paidAmount && touched.payment?.paidAmount ? (
            <div className="invalid-feedback">{errors.payment?.paidAmount}</div>
          ) : null}
        </div>
        <div className="col-sm-4">
          <label htmlFor="paymentSts" className="form-label">
            Status
          </label>
          <select
            className={`form-select ${errors.payment?.status && touched.payment?.status? "is-invalid": ""}`}
            aria-label="Default select example"
            id="paymentSts"
            name="payment.status"
            value={values.payment.status}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">Select Staus</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due</option>
            <option value="Pending">Pending</option>
          </select>
          {errors.payment?.status && touched.payment?.status ? (
            <div className="invalid-feedback">{errors.payment?.status}</div>
          ) : null}
        </div>
        <div className="form-floating">
          <textarea
            className={`form-control ${
              errors.payment?.desc && touched.payment?.desc ? "is-invalid" : ""
            }`}
            id="paymentdescription"
            placeholder="Leave a comment here"
            style={{ height: "100px" }}
            name="payment.desc"
            value={values.payment.desc}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.payment?.desc && touched.payment?.desc ? (
            <div className="invalid-feedback">{errors.payment?.desc}</div>
          ) : null}
          <label htmlFor="paymentdescription">description</label>
        </div>
      </div>
      <div className="d-flex justify-content-end mt-3 myFont gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100px" }}
        >
          {btnText}
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

export default AddForm;
