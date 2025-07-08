import React from "react";

interface props{
    // id : string,
    question : string,
    actionFuction : () => void,
    setModel : (state : boolean) => void,
}

const Modal : React.FC<props> = ({question , actionFuction , setModel}) => {
  return (
    <div
      className="modal fade show glass-effect"
      id="exampleModalCenter"
      tabIndex={-1}
      aria-labelledby="exampleModalCenterTitle"
      aria-modal="true"
      role="dialog"
      style={{display: "block"}}
    >
      <div className="modal-dialog modal-dialog-centered"
            style={{background:'none'}}>
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalCenterTitle">
              Confirmation
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setModel(false)}
            ></button>
          </div>
          <div className="modal-body">
            <p>{question}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={ () => setModel(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-danger" onClick={ () => actionFuction()}>
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
