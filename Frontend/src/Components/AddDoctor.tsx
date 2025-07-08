import React from "react";
interface props{
    triggerOffCanvas:() => void,
    // reloadData:(val : boolean) => void;
}

const AddDoctor : React.FC<props>= ({triggerOffCanvas}) => {
    // const {handleChange , handleSubmit ,touched , errors , values} = useFormik({
    //     onSubmit : (values) =>{
    //         console.log("Hello " + values);
    //     }
    // });
  return (
    <form>
      <div className="mb-2">
        <label htmlFor="name" className="form-label">
          Bill No.
        </label>
        <select className="form-select" aria-label="Default select example">
          <option selected>Select a Bill</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>

      <div className="mb-2">
        <label htmlFor="name" className="form-label">
          Doctor Name
        </label>
        <input
          className="form-control"
          type="text"
          placeholder="Enter the doctor name"
        />
      </div>

      <div className="mb-2">
        <label htmlFor="name" className="form-label">
          Deparment
        </label>
        <input
          className="form-control"
          type="text"
          placeholder="Enter the doctor name"
        />
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
