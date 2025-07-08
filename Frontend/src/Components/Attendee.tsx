import React, { useState } from "react";
import AddDoctor from "./AddDoctor";
import axios from "axios";
import axiosInstance from "../Utils/Axios";

interface billList{
    id :string
    billNo: string
}


const Attendee = () => {
    const[offCanvasView , setOffCanvasView] = useState(false);

    const[billList , setBillList] = useState<billList[]>([])

    const triggerOffCanvas = () => {
        setOffCanvasView(!offCanvasView);
    }

    const fetchBillList = () =>{
        try{
            axiosInstance.get("/UserData/bill_list")
                .then((res) =>{
                    setBillList(res.data)
                    console.log(res.data);
                })
                .catch((err) => console.log(err));
        }catch(e){
            console.log(e);
        }
    }

    const addButtonFunction = () =>{
        triggerOffCanvas();
        fetchBillList();
        console.log(billList);
    }
  return (
    <>
      <div className="m-2 d-flex justify-content-between gap-1">
        <button
          className="btn btn-primary px-4 d-flex"
          style={{ flexWrap: "nowrap" }}
          type="button"
          id="addButton"
            onClick={addButtonFunction}
        >
          <i className="bi bi-plus me-2"></i>
          Add
        </button>
      </div>
      <div
        className={`offcanvas offcanvas-end ${offCanvasView ? "show" : null}`}
        style={{ width: "500px" }}
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
          <AddDoctor
            triggerOffCanvas={triggerOffCanvas}
            // reloadData={setFetchList}
            // formData={fullData}
            // btnText={btnText}
          />
        </div>
      </div>

      <div
        className={`${offCanvasView ? "offcanvas-backdrop fade show" : null}`}
      ></div>
    </>
  );
};

export default Attendee;
