import { useEffect, useState } from "react";
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

  const [searchText , setSearchText] = useState("");

  const getAllURL = "/UserData/list";
  const deleteURL = "/UserData/delete";
  const getUrl = "/UserData/single";

  const fetchData = async () => {
    try {
      var addToSearch : string = "";
      if(searchText.length > 0){
        addToSearch = `?search=${searchText}`
      }
      const res = await axiosInstance.get(getAllURL + addToSearch,);
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

  const [offCanvasView, setOffCanvasView] = useState(false);
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
  }

  // Used for Edit -------------------------------
  

  const getData = async (id: string) => {
    try {
      await axiosInstance.get(`${getUrl}/${id}`).then((res) => setFullData(res.data));
    } catch (e) {
      console.error(e);
    }
  };

  const editData = (id: string) => {
    getData(id);
    triggerOffCanvas();
    setBtnText("Edit")
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
          <i className="bi bi-plus me-2"></i>
          Add
        </button>

        <div className="d-flex gap-2">
          <input
            type="search"
            className="form-control ps-2"
            placeholder="Search"
            style={{ width: "250px" }}
            value={searchText}
            onChange={(e) =>{
              if(e.target.value.trim().length < 1 ){
                setFetchList(true);
              }
              setSearchText(e.target.value)
            }}
            onKeyDown={(e) => {
              if(e.key == "Enter"){
                setFetchList(true);
              }
            }}
          />
          <button
            type="button"
            className={reset ? "reloading" : ""}
            style={{
              backgroundColor: "white",
              border: "none",
              overflow: "hidden",
              padding: "0 5px",
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
                  <tr key={item.id}>
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
                        onClick={() => editData(item.id)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        type="button"
                        className="text-black-50 rounded-circle"
                        style={{ all: "unset", cursor: "pointer" }}
                        onClick={() => confirmDelete(item.id, item.billNo)}
                      >
                        <i className="bi bi-trash-fill text-danger"></i>
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
        className= {`offcanvas offcanvas-end ${offCanvasView ? "show" : null}`}
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
            onClick= {triggerOffCanvas}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <AddForm
            triggerOffCanvas={triggerOffCanvas}
            reloadData={setFetchList}
            formData={fullData}
            btnText = {btnText}
          />
        </div>
      </div>

      <div className={`${offCanvasView ? "offcanvas-backdrop fade show" : null}`}></div>
    </>
  );
};

export default View;
