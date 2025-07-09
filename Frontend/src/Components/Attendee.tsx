import { useEffect, useState } from "react";
import AddDoctor from "./AddDoctor";
import axiosInstance from "../Utils/Axios";
import type { AttendeeResponse } from "../Interface/AttendeeResponse";

export interface billList{
    id :string
    billNo: string
}


const Attendee = () => {
    const[offCanvasView , setOffCanvasView] = useState(false);

    const[billList , setBillList] = useState<billList[]>([])

    const[attendeeList , setAttendeeList] = useState<AttendeeResponse[]>([])

    const[isLoading , setLoading] = useState(false);

    const[reloadData , setReloadData] = useState(false);

    const triggerOffCanvas = () => {
        setOffCanvasView(!offCanvasView);
    }

    useEffect(() => {
      fetchAttendeeList();
    },[])

    useEffect(() => {
      fetchAttendeeList();
    },[reloadData])

    const fetchAttendeeList = () => {
      setLoading(true)
      try{
        axiosInstance.get("/getattendeelist")
          .then((res) => {
            console.log(res.data);
            setAttendeeList(res.data);
          })
      }catch(e){
        console.log(e);
      }finally{
        setLoading(false);
        setReloadData(false);
      }
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

  const deleteData = async(deleteId : string) =>{
    try{
      axiosInstance.post("/deleteattendeelist" , deleteId)
        .then((res) => {
          console.log(res);
          setReloadData(true);
        })
        .catch((error) => console.error(error));

    }catch(error){
      console.log(error);
    }finally{
      setReloadData(true);
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


      <div className="table-responsive-md">
        <table className="table table-striped mt-3 w-100 table-hover">
          <thead>
            <tr className="">
              <th scope="col text-center">S NO.</th>
              <th scope="col">Bill Id</th>
              <th scope="col">Attendee Name</th>
              <th scope="col">Deparment</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              attendeeList.map((item: AttendeeResponse) => {
                return (
                  <tr key={item.id}>
                    <th scope="row">{item.slNo}</th>
                    <td>{item.billNo}</td>
                    <td>{item.attendeeName}</td>
                    <td>{item.dept}</td>
                    <td className="d-flex gap-3">
                      <button
                        type="button"
                        className="text-black-50 rounded-circle"
                        style={{ all: "unset", cursor: "pointer" }}
                        onClick={() => deleteData(item.id)}
                      >
                        <i className="bi bi-trash-fill text-danger"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
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
            BillList={billList}
            reloadData={setReloadData}
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
