import { useEffect, useState, type ChangeEvent } from "react";
import AddForm from "./AddForm";
import type { UserResponse } from "../Interface/UserResponse";
import "../index.css";
import Modal from "./Modal";
import type { User } from "../Interface/UserData";
import axiosInstance from "../Utils/Axios";

const InitialUSerData: User = {
  id: "",
  personalDetails: {
    email: "",
    name: "",
    phNo: "",
  },

  address: {
    building: "",
    street: "",
    city: "",
    state: "",
    country: "",
  },

  itemDetails: [
    {
      itemDesc: "",
      quantity: "",
      price: "",
      gst: "",
      amount: 0,
    },
  ],

  payment: {
    paidAmount: "",
    status: "",
    desc: "",
  },
};

const View = () => {
  const [userData, setuserData] = useState<UserResponse[]>([]);

  const [fetchList, setFetchList] = useState(true);

  const [isLoading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");

  const [listActive, setListActive] = useState(true);

  const [offCanvasView, setOffCanvasView] = useState(false);

  const [SelectView, setSelectView] = useState(false);

  const getAllURL = "/UserData/list";
  const deleteURL = "/UserData/delete";
  const getUrl = "/UserData/single";

  const fetchData = async () => {
    try {
      var addToSearch: string = "?sortDir=asc&sort=false";
      //adding search list
      addToSearch += `&search=${searchText.trim()}`;

      // To get active or deleted list
      addToSearch += `&active=${listActive}`;
      const res = await axiosInstance.get(getAllURL + addToSearch);
      console.log(res.data);
      setuserData(res.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
      setFetchList(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchList]);

  const triggerOffCanvas = () => {
    setOffCanvasView(!offCanvasView);
  };

  const [reset, setReset] = useState(false);
  const relaoding = () => {
    setReset(true);
    setTimeout(() => setReset(false), 1000);
  };
  const [fullData, setFullData] = useState<User>(InitialUSerData);
  const [btnText, setBtnText] = useState("Submit");
  const addData = () => {
    setFullData(InitialUSerData);
    triggerOffCanvas();
    setBtnText("Add Data");
  };

  // Used for Edit -------------------------------

  const getData = async (id: string) => {
    try {
      await axiosInstance
        .get(`${getUrl}/${id}`)
        .then((res) => setFullData(res.data));
    } catch (e) {
      console.error(e);
    }
  };

  const editData = (id: string) => {
    getData(id);
    triggerOffCanvas();
    setBtnText("Edit");
  };

  // Used to Delete ---------------
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [billNo, setBillNo] = useState("");

  const confirmDelete = (id: string, bno: string) => {
    setDeleteId(id);
    setBillNo(bno);
    setShowModal(true);
  };

  const DownloadPdf = async (bno: string) => {
    try {
      const res = await axiosInstance.get(
        `UserData/download-invoice?billNo=${bno}`,
        {
          responseType: "blob",
        }
      );

      const file = new Blob([res.data], { type: "application/pdf" });

      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `invoice-${bno}.pdf`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const deleteData = async () => {
    try {
      const res = await axiosInstance.post(`${deleteURL}/${deleteId}`);
      console.log(res);
      setFetchList(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setShowModal(false);
    }
  };

  const handleShowBill = async (id: string) => {
    getData(id);
    setSelectView(true);
  };

  return (
    <>
      <div className="m-2 d-flex justify-content-between gap-1">
        <button
          className="btn btn-primary px-4 d-flex"
          style={{ flexWrap: "nowrap" }}
          type="button"
          id="addButton"
          onClick={addData}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add
        </button>

        <div className="d-flex gap-2">
          <input
            type="search"
            className="form-control ps-2"
            placeholder="Search"
            style={{ width: "250px" }}
            value={searchText}
            onChange={(e) => {
              if (e.target.value.trim().length < 1) {
                setFetchList(true);
              }
              setSearchText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                setFetchList(true);
              }
            }}
          />

          <select
            className="form-select"
            aria-label="Default select example"
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              let activeValue: boolean = e.target.value === "0" ? true : false;
              setListActive((pre) => activeValue);
              relaoding();
              setFetchList(true);
            }}
            value={listActive ? "0" : "1"}
          >
            <option value="0" selected>
              Active
            </option>
            <option value="1">Deleted</option>
          </select>
          <button
            type="button"
            className={reset ? "reloading" : ""}
            style={{
              backgroundColor: "transparent",
              border: "none",
              overflow: "hidden",
              padding: "0 5px",
              width: "100px",
            }}
            onClick={() => {
              relaoding();
              setFetchList(true);
            }}
          >
            <i
              className="bi bi-arrow-clockwise"
              style={{ fontSize: "25px" }}
            ></i>
          </button>
        </div>
      </div>

      <div className="table-responsive-md">
        <table className="table table-striped mt-3 w-100 table-hover">
          <thead>
            <tr className="">
              <th scope="col text-center">S NO.</th>
              <th scope="col">Bill Id</th>
              <th scope="col text-center">Name</th>
              <th scope="col">Attendee</th>
              <th scope="col">Phone No.</th>
              <th scope="col">Email</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              userData.map((item: UserResponse) => {
                return (
                  <tr
                    key={item.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleShowBill(item.id)}
                  >
                    <th scope="row">{item.slNo}</th>
                    <td>{item.billNo}</td>
                    <td>{item.name}</td>
                    <td>{item.attendeeName}</td>
                    <td>{item.phoneNo}</td>
                    <td>{item.email}</td>
                    <td className="d-flex gap-3">
                      <button
                        type="button"
                        className="text-black-50 rounded-circle"
                        style={{ all: "unset", cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          editData(item.id);
                        }}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        type="button"
                        className="text-black-50 rounded-circle"
                        style={{ all: "unset", cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(item.id, item.billNo);
                        }}
                      >
                        <i className="bi bi-trash-fill text-danger"></i>
                      </button>

                      <button
                        type="button"
                        className="text-black-50 rounded-circle"
                        style={{ all: "unset", cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          DownloadPdf(item.billNo);
                        }}
                      >
                        <i className="bi bi-download text-primary"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {showModal ? (
          <Modal
            question={`Are you sure , you want to delete Bill No(${billNo}) ?`}
            setModel={setShowModal}
            actionFuction={deleteData}
          />
        ) : null}
      </div>

      {/* Off canvas for input */}

      <div
        className={`offcanvas offcanvas-end ${offCanvasView ? "show" : null}`}
        style={{ width: "600px" }}
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header p-2 ps-3">
          <h5 className="offcanvas-title" id="offcanvasRightLabel">
            Add Request
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={triggerOffCanvas}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <AddForm
            triggerOffCanvas={triggerOffCanvas}
            reloadData={setFetchList}
            formData={fullData}
            btnText={btnText}
          />
        </div>
      </div>

      <div
        className={`${offCanvasView ? "offcanvas-backdrop fade show" : null}`}
      ></div>
      <div
        className={`${SelectView ? "offcanvas-backdrop fade show" : "null"}`}
      ></div>
      {SelectView ? (
        <div
          className={`${SelectView ? "modal fade show" : ""}`}
          id="exampleModalCenteredScrollable"
          tabIndex={-1}
          aria-labelledby="exampleModalCenteredScrollableTitle"
          aria-modal="true"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h1
                  className="modal-title fs-5"
                  id="exampleModalCenteredScrollableTitle"
                >
                  Invoice View (Bill no : {fullData.billNo})
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setSelectView(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Bill Info */}
                {fullData.billNo && (
                  <div className="mb-4">
                    <h5 className="text-primary border-bottom pb-2">
                      Bill Info
                    </h5>
                    <p className="mb-1">
                      <strong>Bill No:</strong> {fullData.billNo}
                    </p>
                  </div>
                )}

                {/* Personal Details */}
                <div className="mb-4">
                  <h5 className="text-primary border-bottom pb-2">
                    Personal Details
                  </h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-1">
                        <strong>Name:</strong> {fullData.personalDetails.name}
                      </p>
                      <p className="mb-1">
                        <strong>Email:</strong> {fullData.personalDetails.email}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1">
                        <strong>Phone:</strong> {fullData.personalDetails.phNo}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <h5 className="text-primary border-bottom pb-2">Address</h5>
                  <p className="mb-0">
                    {fullData.address.building}, {fullData.address.street},
                    <br />
                    {fullData.address.city}, {fullData.address.state},{" "}
                    {fullData.address.country}
                  </p>
                </div>

                {/* Item Details */}
                <div className="mb-4">
                  <h5 className="text-primary border-bottom pb-2">
                    Item Details
                  </h5>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped table-sm align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>Description</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>GST</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fullData.itemDetails.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.itemDesc}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price}</td>
                            <td>{item.gst}%</td>
                            <td>
                              <strong>₹{item.amount}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Payment */}
                <div className="mb-3">
                  <h5 className="text-primary border-bottom pb-2">Payment</h5>
                  <p className="mb-1">
                    <strong>Paid Amount:</strong> ₹{fullData.payment.paidAmount}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong>
                    <span
                      className={`badge ms-2 ${
                        fullData.payment.status === "Paid"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {fullData.payment.status}
                    </span>
                  </p>
                  <p className="mb-0">
                    <strong>Description:</strong> {fullData.payment.desc}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectView(false);
                    editData(fullData.id!);
                  }}
                >
                  <i
                    className="bi bi-pencil-square"
                    style={{ marginRight: "10px" }}
                  ></i>{" "}
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default View;
